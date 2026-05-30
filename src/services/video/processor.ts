// FFmpeg Video Processing Service
import { createFFmpeg, FFmpeg } from '@ffmpeg/ffmpeg';

export interface ProcessingOptions {
  trim?: { start: number; end: number };
  speed?: number;
  rotate?: number;
  watermark?: { text: string; position: string };
  outputFormat?: 'mp4' | 'webm' | 'gif';
  quality?: 'low' | 'medium' | 'high';
}

export interface ProcessingResult {
  success: boolean;
  outputUrl?: string;
  outputBlob?: Blob;
  duration?: number;
  error?: string;
}

class VideoProcessorService {
  private ffmpeg: FFmpeg | null = null;
  private isLoaded: boolean = false;
  private loadingPromise: Promise<void> | null = null;

  async load(): Promise<void> {
    if (this.isLoaded) return;
    if (this.loadingPromise) return this.loadingPromise;

    this.loadingPromise = (async () => {
      try {
        this.ffmpeg = createFFmpeg({
          log: true,
          corePath: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js'
        });
        
        console.log('Loading FFmpeg...');
        await this.ffmpeg.load();
        this.isLoaded = true;
        console.log('FFmpeg loaded successfully');
      } catch (error) {
        console.error('Failed to load FFmpeg:', error);
        throw error;
      }
    })();

    return this.loadingPromise;
  }

  async processVideo(
    videoBlob: Blob,
    options: ProcessingOptions,
    onProgress?: (progress: number) => void
  ): Promise<ProcessingResult> {
    try {
      if (!this.ffmpeg || !this.isLoaded) {
        await this.load();
      }

      if (!this.ffmpeg) {
        return { success: false, error: 'FFmpeg not initialized' };
      }

      // Set progress callback
      this.ffmpeg.on('progress', ({ progress }) => {
        if (onProgress) {
          onProgress(Math.round(progress * 100));
        }
      });

      // Write input file
      const inputName = 'input.mp4';
      const outputName = this.getOutputName(options.outputFormat || 'mp4');
      
      console.log('Writing video to FFmpeg...');
      await this.ffmpeg.writeFile(inputName, await fetchFile(videoBlob));

      // Build FFmpeg command
      const args: string[] = ['-i', inputName];

      // Trim
      if (options.trim) {
        args.push('-ss', options.trim.start.toString());
        args.push('-to', options.trim.end.toString());
      }

      // Speed
      if (options.speed && options.speed !== 1) {
        args.push('-filter:v', `setpts=${1/options.speed}*PTS`);
      }

      // Rotate
      if (options.rotate) {
        const rotationMap: Record<number, string> = {
          90: 'transpose=1',
          180: 'transpose=2,transpose=2',
          270: 'transpose=2',
        };
        if (rotationMap[options.rotate]) {
          args.push('-vf', rotationMap[options.rotate]);
        }
      }

      // Watermark (text overlay)
      if (options.watermark) {
        const watermarkFilter = `drawtext=text='${options.watermark.text}':fontsize=24:fontcolor=white:x=10:y=10`;
        args.push('-vf', watermarkFilter);
      }

      // Quality
      const crfMap: Record<string, string> = {
        low: '28',
        medium: '23',
        high: '18'
      };
      const crf = crfMap[options.quality || 'medium'];
      args.push('-crf', crf);

      // Output format
      if (options.outputFormat === 'webm') {
        args.push('-c:v', 'libvpx-vp9', '-c:a', 'libopus');
      } else if (options.outputFormat === 'gif') {
        args.push('-c:v', 'gif');
      } else {
        args.push('-c:v', 'libx264', '-c:a', 'aac');
      }

      args.push(outputName);

      console.log('Processing video with FFmpeg...');
      console.log('Args:', args);

      await this.ffmpeg.exec(args);

      // Read output
      const data = await this.ffmpeg.readFile(outputName);
      const outputBlob = new Blob([data], { 
        type: this.getMimeType(options.outputFormat || 'mp4') 
      });

      // Create URL for download
      const outputUrl = URL.createObjectURL(outputBlob);

      // Cleanup
      await this.ffmpeg.deleteFile(inputName);
      await this.ffmpeg.deleteFile(outputName);

      return {
        success: true,
        outputUrl,
        outputBlob,
        duration: videoBlob.size / (1024 * 1024) // approximate
      };

    } catch (error) {
      console.error('Video processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Processing failed'
      };
    }
  }

  private getOutputName(format: string): string {
    switch (format) {
      case 'webm': return 'output.webm';
      case 'gif': return 'output.gif';
      default: return 'output.mp4';
    }
  }

  private getMimeType(format: string): string {
    switch (format) {
      case 'webm': return 'video/webm';
      case 'gif': return 'image/gif';
      default: return 'video/mp4';
    }
  }

  async addSubtitles(
    videoBlob: Blob,
    subtitleContent: string,
    format: 'srt' | 'vtt' = 'srt'
  ): Promise<ProcessingResult> {
    try {
      if (!this.ffmpeg || !this.isLoaded) {
        await this.load();
      }

      if (!this.ffmpeg) {
        return { success: false, error: 'FFmpeg not initialized' };
      }

      const inputName = 'input.mp4';
      const subtitleName = `subtitles.${format}`;
      const outputName = 'output-with-subs.mp4';

      await this.ffmpeg.writeFile(inputName, await fetchFile(videoBlob));
      await this.ffmpeg.writeFile(subtitleName, subtitleContent);

      await this.ffmpeg.exec([
        '-i', inputName,
        '-vf', `subtitles=${subtitleName}`,
        '-c:a', 'copy',
        outputName
      ]);

      const data = await this.ffmpeg.readFile(outputName);
      const outputBlob = new Blob([data], { type: 'video/mp4' });
      const outputUrl = URL.createObjectURL(outputBlob);

      await this.ffmpeg.deleteFile(inputName);
      await this.ffmpeg.deleteFile(subtitleName);
      await this.ffmpeg.deleteFile(outputName);

      return { success: true, outputUrl, outputBlob };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add subtitles'
      };
    }
  }

  async extractAudio(videoBlob: Blob): Promise<ProcessingResult> {
    try {
      if (!this.ffmpeg || !this.isLoaded) {
        await this.load();
      }

      if (!this.ffmpeg) {
        return { success: false, error: 'FFmpeg not initialized' };
      }

      const inputName = 'input.mp4';
      const outputName = 'audio.mp3';

      await this.ffmpeg.writeFile(inputName, await fetchFile(videoBlob));

      await this.ffmpeg.exec([
        '-i', inputName,
        '-vn',
        '-acodec', 'libmp3lame',
        '-q:a', '2',
        outputName
      ]);

      const data = await this.ffmpeg.readFile(outputName);
      const outputBlob = new Blob([data], { type: 'audio/mp3' });
      const outputUrl = URL.createObjectURL(outputBlob);

      await this.ffmpeg.deleteFile(inputName);
      await this.ffmpeg.deleteFile(outputName);

      return { success: true, outputUrl, outputBlob };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to extract audio'
      };
    }
  }

  terminate(): void {
    if (this.ffmpeg) {
      this.ffmpeg.terminate();
      this.ffmpeg = null;
      this.isLoaded = false;
    }
  }
}

// Helper function to convert Blob to Uint8Array
async function fetchFile(file: Blob): Promise<Uint8Array> {
  return new Uint8Array(await file.arrayBuffer());
}

export const videoProcessor = new VideoProcessorService();
export default videoProcessor;