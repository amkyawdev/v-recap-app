import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiVideo, FiFileText, FiZap, FiShield, 
  FiSmartphone, FiCloud, FiCode, FiHeart
} from 'react-icons/fi';
import { HamburgerMenu } from '../components/Common/HamburgerMenu';
import { SideMenu } from '../components/Common/SideMenu';

const About: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const features = [
    {
      icon: FiVideo,
      title: 'Video Editing',
      description: 'Powerful yet simple video editing tools with timeline support'
    },
    {
      icon: FiFileText,
      title: 'Subtitle Creator',
      description: 'Create and customize subtitles with multiple language support'
    },
    {
      icon: FiZap,
      title: 'AI-Powered',
      description: 'Smart features powered by AI for automatic translations'
    },
    {
      icon: FiShield,
      title: 'Privacy First',
      description: 'Your videos stay on your device. No cloud uploads.'
    },
    {
      icon: FiSmartphone,
      title: 'Mobile Ready',
      description: 'Optimized for both desktop and mobile devices'
    },
    {
      icon: FiCloud,
      title: 'Export Anywhere',
      description: 'Export to multiple formats for any platform'
    },
  ];

  const techStack = [
    'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion',
    'Vite', 'Zustand', 'React Router'
  ];

  return (
    <div className="min-h-screen">
      <HamburgerMenu onClick={() => setIsMenuOpen(true)} isOpen={isMenuOpen} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="pt-20 px-4 pb-8 max-w-4xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-accent-500 shadow-lg shadow-red-500/30 mb-6">
            <span className="text-4xl font-bold text-white">V</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">V Recap</h1>
          <p className="text-xl text-white/70 mb-2">Video Editing Made Simple</p>
          <p className="text-white/50">Version 1.0.0</p>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">About This App</h2>
          <p className="text-white/80 leading-relaxed mb-4">
            V Recap is a modern, privacy-focused video editing application designed for creators 
            who want a simple yet powerful tool for video editing and subtitle creation.
          </p>
          <p className="text-white/80 leading-relaxed">
            Built with the latest web technologies, V Recap runs entirely in your browser 
            with no server-side processing. Your videos never leave your device, ensuring 
            complete privacy and security.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="card p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-accent-500/20">
                    <feature.icon className="text-2xl text-accent-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-white/60">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="card p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <FiCode className="text-accent-500" />
            Built With
          </h2>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-xl bg-white/10 text-white/80 text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-white/50"
        >
          <p className="flex items-center justify-center gap-2 mb-2">
            Made with <FiHeart className="text-red-500" /> using React & TypeScript
          </p>
          <p className="text-sm">© 2024 V Recap. All rights reserved.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;