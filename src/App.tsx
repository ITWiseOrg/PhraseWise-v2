import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, RefreshCw, Shield, Check, Key, Sparkles, Zap, LogOut } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';

// Regular word lists with expanded dictionary
const REGULAR_WORDS = {
  adjectives: ['Happy', 'Clever', 'Brave', 'Bright', 'Swift', 'Calm', 'Wise', 'Kind', 'Bold', 'Quick', 'Gentle', 'Sharp', 'Smart', 'Strong', 'Warm', 'Fresh', 'Sweet', 'Proud', 'Pure', 'Rich', 'Soft', 'Wild', 'Young', 'Grand', 'Prime', 'Fair', 'Light', 'Noble', 'Royal', 'Sleek'],
  nouns: ['Tiger', 'River', 'Mountain', 'Sunset', 'Ocean', 'Forest', 'Eagle', 'Castle', 'Dragon', 'Star', 'Phoenix', 'Crystal', 'Thunder', 'Garden', 'Spirit', 'Falcon', 'Diamond', 'Lotus', 'Breeze', 'Shadow', 'Heart', 'Storm', 'Moon', 'Cloud', 'Lion', 'Pearl', 'Rose', 'Wave', 'Dream', 'Dawn'],
  verbs: ['Jumps', 'Flows', 'Shines', 'Flies', 'Runs', 'Dances', 'Sings', 'Dreams', 'Glows', 'Soars', 'Rises', 'Leaps', 'Floats', 'Glides', 'Sparks', 'Drifts', 'Sweeps', 'Spins', 'Swirls', 'Beams', 'Blooms', 'Rides', 'Sails', 'Waves', 'Rolls', 'Plays', 'Moves', 'Races', 'Zooms', 'Lifts'],
  numbers: ['2', '3', '4', '5', '6', '7', '8', '9'],
  symbols: ['!', '@', '#', '$', '%', '&']
};

// Special word lists with expanded dictionary
const SPECIAL_WORDS = {
  adjectives: ['Goofy', 'Soggy', 'Boneless', 'Feral', 'Beefy', 'Spicy', 'Crusty', 'Zesty', 'Wonky', 'Chunky', 'Slippery', 'Cheesy', 'Wobbly', 'Yappy', 'Boofed', 'Schmoovy', 'Grubby', 'Sneaky', 'Drippy', 'Vibey', 'Squishy', 'Derpy', 'Wiggly', 'Sassy', 'Funky', 'Janky', 'Loopy', 'Wacky', 'Bouncy', 'Fluffy'],
  nouns: ['Rizzlord', 'Gremlin', 'Bozo', 'Yeeter', 'Shrek', 'Goblin', 'Npc', 'Biscuit', 'Nugget', 'Gronk', 'Gibby', 'Skibidi', 'Bonk', 'Dingle', 'Pingu', 'Dooter', 'Bongo', 'Muppet', 'Squidward', 'Blobfish', 'Chungus', 'Pepe', 'Doge', 'Monke', 'Birb', 'Chonker', 'Floof', 'Borker', 'Yoshi', 'Sponge'],
  verbs: ['Skibbles', 'Bops', 'Boofs', 'Schmooves', 'Lurks', 'Slaps', 'Wiggles', 'Yeets', 'Claps', 'Dribbles', 'Zips', 'Zooms', 'Bonks', 'Flops', 'Jiggles', 'Snaps', 'Chomps', 'Waddles', 'Shmoops', 'Shuffles', 'Derps', 'Yoinks', 'Borks', 'Nyooms', 'Vibes', 'Zoomies', 'Sploots', 'Boings', 'Cronches', 'Yeets'],
  numbers: ['69', '420', '404', '1337', '9000', '360', '777', '182', '101', '666', '8008', '5318008', '69420', '9999', '4321', '2468'],
  symbols: ['!', '@', '#', '$', '%', '&', '*', '?', '~', '^', '+', '=', '<', '>', '|', '_']
};

function App() {
  const [passphrase, setPassphrase] = useState('');
  const [charLength, setCharLength] = useState(12);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [useSpecialWords, setUseSpecialWords] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

  const generatePassphrase = () => {
    setIsGenerating(true);
    const words = useSpecialWords ? SPECIAL_WORDS : REGULAR_WORDS;
    let phrase = [];

    let reservedSpace = 0;
    if (includeNumbers) reservedSpace += 1;
    if (includeSymbols) reservedSpace += 1;

    let availableLength = charLength - reservedSpace;
    let currentLength = 0;

    while (currentLength < availableLength) {
      const wordTypes = ['adjectives', 'nouns', 'verbs'];
      const randomType = wordTypes[Math.floor(Math.random() * wordTypes.length)];
      const word = words[randomType][Math.floor(Math.random() * words[randomType].length)];

      if (currentLength + word.length <= availableLength) {
        phrase.push(word);
        currentLength += word.length;
      } else {
        break;
      }
    }

    if (includeNumbers) {
      phrase.push(words.numbers[Math.floor(Math.random() * words.numbers.length)]);
    }

    if (includeSymbols) {
      phrase.push(words.symbols[Math.floor(Math.random() * words.symbols.length)]);
    }

    setPassphrase(phrase.join(''));
    setTimeout(() => setIsGenerating(false), 300);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(passphrase);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  useEffect(() => {
    generatePassphrase();
  }, [charLength, includeNumbers, includeSymbols, useSpecialWords]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 p-8 rounded-xl shadow-lg text-center"
        >
          <h1 className="text-3xl font-bold text-white mb-4">Welcome to PhraseWise</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => loginWithRedirect()}
            className="px-6 py-2 bg-white/10 text-white/80 rounded-lg shadow-md hover:bg-white/20 hover:text-white transition-all duration-300 font-medium flex items-center justify-center mx-auto"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span>Log In</span>
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-4 relative">
    {/* User Profile Section */}
    <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="absolute top-4 right-4 bg-white/10 backdrop-blur-lg rounded-xl p-4 shadow-lg flex flex-col space-y-2 border border-white/20"
    >
    <div className="text-white text-sm">
    <p className="font-semibold">{user?.name}</p>
    <p className="text-white/70">{user?.email}</p>
    </div>
    <button
    onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
    className="px-4 py-1 bg-transparent text-white/80 rounded-lg shadow hover:opacity-90 transition flex items-center justify-center space-x-2 self-start"
    >
    <LogOut className="w-4 h-4" />
    <span className="text-sm">Log Out</span>
    </button>
    </motion.div>

      {/* Passphrase Generator */}
      <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative overflow-hidden border border-white/20"
      >
      <AnimatePresence mode="wait">
      <motion.div
      key={passphrase}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative mb-2"
      >
      <div className="bg-white/20 rounded-2xl p-6 break-all font-mono text-2xl text-white shadow-lg backdrop-blur-sm border border-white/10">
        {passphrase}
      </div>
      </motion.div>
      </AnimatePresence>

      <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={copyToClipboard}
      className="w-full mb-6 py-2 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium flex items-center justify-center space-x-2 transition-all duration-300 hover:bg-white/20 border border-white/10 hover:border-purple-500/50"
      >
      {copied ? (
      <>
        <Check className="w-5 h-5 mr-2" />
        <span>Copied!</span>
      </>
      ) : (
      <>
        <Copy className="w-5 h-5 mr-2" />
        <span>Copy to Clipboard</span>
      </>
      )}
      </motion.button>

      <div className="space-y-6">
      <div>
      <label className="flex justify-between text-white mb-3">
        <span className="flex items-center text-white/80">
        <Sparkles className="w-4 h-4 mr-2" />
        Characters: {charLength}
        </span>
        <motion.button
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
        onClick={generatePassphrase}
        className="text-purple-300 hover:text-white transition-colors bg-white/10 rounded-lg p-2 backdrop-blur-sm"
        >
        <RefreshCw className="w-5 h-5" />
        </motion.button>
      </label>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm"
      >
        <input
        type="range"
        min="8"
        max="32"
        value={charLength}
        onChange={(e) => setCharLength(parseInt(e.target.value))}
        className="absolute w-full h-full opacity-0 cursor-pointer"
        style={{ touchAction: 'none' }}
        />
        <motion.div
        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
        animate={{
        width: `${((charLength - 8) / 24) * 100}%`,
        }}
        transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        }}
        />
      </motion.div>
      </div>

      <div className="flex flex-wrap gap-3">
      {[{ label: 'Numbers', checked: includeNumbers, setter: setIncludeNumbers },
        { label: 'Symbols', checked: includeSymbols, setter: setIncludeSymbols },
        { label: 'Special Words', checked: useSpecialWords, setter: setUseSpecialWords, icon: <Zap className="w-4 h-4 mr-1" /> },
      ].map((option) => (
        <motion.label
        key={option.label}
        className="flex items-center space-x-2 text-white cursor-pointer group bg-white/10 rounded-xl px-4 py-2 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        >
        <motion.div
        className="relative"
        initial={false}
        animate={option.checked ? { scale: [null, 1.2, 1] } : { scale: 1 }}
        transition={{ duration: 0.2 }}
        >
        <input
        type="checkbox"
        checked={option.checked}
        onChange={(e) => option.setter(e.target.checked)}
        className="w-4 h-4 rounded-md bg-white/20 border-2 border-purple-300 checked:bg-purple-500 checked:border-transparent transition-colors"
        />
        </motion.div>
        <span className="group-hover:text-purple-300 transition-colors flex items-center text-white/80">
        {option.icon}
        {option.label}
        </span>
        </motion.label>
      ))}
      </div>

      <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={generatePassphrase}
      className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20"
      >
      <Key className="w-5 h-5" />
      <span>Generate New Phrase</span>
      </motion.button>
      </div>
      </motion.div>
    </div>
  );
}

export default App;