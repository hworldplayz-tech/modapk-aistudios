import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Send, 
  AlertCircle, 
  FileText, 
  Heart, 
  ArrowLeft, 
  ExternalLink,
  Layers,
  Sparkles,
  CheckCircle2,
  Server,
  Zap,
  Globe
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ApkCard } from './ApkCard';

export const AboutPage: React.FC = () => {
  const { setActivePage } = useApp();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16">
      <button 
        onClick={() => setActivePage('home')}
        className="text-xs sm:text-sm text-zinc-500 hover:text-emerald-500 flex items-center gap-1 font-semibold cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Home
      </button>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-10 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500 text-emerald-500 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-zinc-900 dark:text-zinc-100">
              About MODAPKs
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Powered by <a href="https://linksshare.online" target="_blank" rel="noreferrer" className="text-emerald-500 font-bold hover:underline">linksshare.online</a>
            </p>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed space-y-4">
          <p>
            Welcome to <strong>MODAPKs</strong>, your premier destination for 100% working, verified, and lightning-fast Android mod APK downloads. Our mission is to provide Android gamers and enthusiasts with unrestricted access to premium unlocked applications, unlimited resources, and ad-free utilities.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2">
              <Zap className="w-6 h-6 text-emerald-500" />
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Lightning CDN Speed</h3>
              <p className="text-xs text-zinc-500">
                Direct gigabit mirror servers ensuring maximum download speeds with zero throttles.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">100% Virus Scanned</h3>
              <p className="text-xs text-zinc-500">
                Every APK signature and hash is verified through VirusTotal engines before publishing.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2">
              <Globe className="w-6 h-6 text-emerald-500" />
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Powered by linksshare</h3>
              <p className="text-xs text-zinc-500">
                Part of the linksshare high-performance web distribution ecosystem.
              </p>
            </div>
          </div>

          <p>
            We take pride in strict quality testing. Every mod featured in our catalog undergoes rigorous functional checks to ensure that features like unlimited currencies, VIP access, and ad removal function without root access.
          </p>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { setActivePage, showNotification } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Mod Request');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    showNotification('Message sent! Our support team will get back to you.', 'success');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16">
      <button 
        onClick={() => setActivePage('home')}
        className="text-xs sm:text-sm text-zinc-500 hover:text-emerald-500 flex items-center gap-1 font-semibold cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Home
      </button>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-10 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500 text-emerald-500 flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-zinc-900 dark:text-zinc-100">
              Contact & Mod Request
            </h1>
            <p className="text-xs text-zinc-500">
              Request a game mod, report broken download links, or inquire for partnerships.
            </p>
          </div>
        </div>

        {sent ? (
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/40 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-emerald-800 dark:text-emerald-300">
              Message Received!
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              Thank you for contacting MODAPKs. We typically respond within 24 hours.
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-3 text-xs font-bold text-emerald-600 dark:text-emerald-400 underline"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Alex"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="alex@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Mod Request">Request a New Mod APK</option>
                <option value="Broken Link">Report Broken Download Link</option>
                <option value="DMCA Takedown">DMCA / Copyright Notice</option>
                <option value="General Support">General Feedback / Support</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Your Message</label>
              <textarea
                rows={4}
                required
                placeholder="Describe your request or issue..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC = () => {
  const { setActivePage } = useApp();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16">
      <button 
        onClick={() => setActivePage('home')}
        className="text-xs sm:text-sm text-zinc-500 hover:text-emerald-500 flex items-center gap-1 font-semibold cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Home
      </button>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-10 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
        <h1 className="text-2xl sm:text-3xl font-black font-display text-zinc-900 dark:text-zinc-100">
          Privacy Policy
        </h1>
        <p className="text-xs text-zinc-400">Effective Date: January 2026</p>

        <div className="prose dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed space-y-4">
          <p>
            At <strong>MODAPKs</strong> (powered by linksshare.online), we value and respect your privacy. This policy outlines the types of information we collect and how we utilize it.
          </p>

          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">1. Information We Collect</h3>
          <p>
            We do not require personal registration or sign-ups for browsing and downloading APKs. Non-personally identifiable log information (such as browser type, operating system version, and general download telemetry) may be recorded for performance optimization.
          </p>

          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">2. Cookies & Local Storage</h3>
          <p>
            We use local browser storage strictly to preserve your user preferences (such as Dark/Light theme mode, list of saved Favorites, and rating interactions).
          </p>

          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">3. Third-Party Hosting & Mirrors</h3>
          <p>
            MODAPKs provides high-speed CDN mirrors. When navigating to third-party file repositories (such as MediaFire, Mega, or Google Drive), their respective privacy terms apply.
          </p>
        </div>
      </div>
    </div>
  );
};

export const DmcaPage: React.FC = () => {
  const { setActivePage } = useApp();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16">
      <button 
        onClick={() => setActivePage('home')}
        className="text-xs sm:text-sm text-zinc-500 hover:text-emerald-500 flex items-center gap-1 font-semibold cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Home
      </button>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-10 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500 text-amber-500 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-zinc-900 dark:text-zinc-100">
              DMCA & Copyright Disclaimer
            </h1>
            <p className="text-xs text-zinc-500">
              Digital Millennium Copyright Act Notice & Compliance
            </p>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed space-y-4">
          <p>
            <strong>MODAPKs</strong> is an informational directory and educational indexing platform for Android applications. We respect the intellectual property rights of all content creators and publishers.
          </p>
          <p>
            All trademarks, logos, package identities, and copyrights featured on this website are the property of their respective owners. If you are a copyright holder and believe that any content indexed on MODAPKs infringes upon your copyright, please submit a notice with the following details:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>Identification of the copyrighted work claimed to have been infringed.</li>
            <li>Direct URL link to the specific page on MODAPKs containing the material.</li>
            <li>Your contact information (name, organization, email address).</li>
            <li>A statement affirming good-faith belief that use of the material is unauthorized.</li>
          </ul>
          <p>
            Send all takedown requests through our <button onClick={() => setActivePage('contact')} className="text-emerald-500 font-bold underline">Contact Form</button> with the subject "DMCA Takedown", and we will process the removal within 24–48 business hours.
          </p>
        </div>
      </div>
    </div>
  );
};

export const FavoritesPage: React.FC = () => {
  const { favorites, apks, setActivePage } = useApp();
  const favoritedApks = apks.filter(a => favorites.includes(a.id));

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 border border-rose-200 dark:border-rose-800">
            <Heart className="w-6 h-6 fill-rose-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black font-display text-zinc-900 dark:text-zinc-100">
              My Saved Favorites ({favoritedApks.length})
            </h1>
            <p className="text-xs text-zinc-500">
              Quickly access and update your favorited modded games and apps.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActivePage('home')}
          className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
        </button>
      </div>

      {favoritedApks.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center border border-zinc-200 dark:border-zinc-800 space-y-4">
          <Heart className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto" />
          <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
            No Favorites Added Yet
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Click the heart icon on any game or app card to save it here for quick updates and downloads.
          </p>
          <button
            onClick={() => setActivePage('home')}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-xs"
          >
            Explore Mod APKs
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {favoritedApks.map((apk) => (
            <ApkCard key={apk.id} apk={apk} />
          ))}
        </div>
      )}
    </div>
  );
};
