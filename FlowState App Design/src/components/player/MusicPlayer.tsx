// //import React, { useState, useRef, useEffect } from 'react';
// import { motion, AnimatePresence } from "framer-motion";
// import { Play, Pause, Volume2 } from 'lucide-react';
// import { Slider } from './ui/slider';

// interface Track {
//   id: number;
//   title: string;
//   mood: string;
//   emoji: string;
//   gradient: string;
//   soundType: 'white' | 'pink' | 'brown' | 'rain' | 'waves' | 'wind' | 'stream' | 'thunder';
// }

// const tracks: Track[] = [
//   {
//     id: 1,
//     title: 'White Noise',
//     mood: 'Focus & Concentration',
//     emoji: '☁️',
//     gradient: 'from-blue-200 to-lavender-200',
//     soundType: 'white',
//   },
//   {
//     id: 2,
//     title: 'Forest Rain',
//     mood: 'Natural & Soothing',
//     emoji: '🌧️',
//     gradient: 'from-green-200 to-teal-200',
//     soundType: 'rain',
//   },
//   {
//     id: 3,
//     title: 'Ocean Waves',
//     mood: 'Relaxing & Deep',
//     emoji: '🌊',
//     gradient: 'from-cyan-200 to-blue-300',
//     soundType: 'waves',
//   },
//   {
//     id: 4,
//     title: 'Pink Noise',
//     mood: 'Calm & Balanced',
//     emoji: '🎹',
//     gradient: 'from-purple-200 to-pink-200',
//     soundType: 'pink',
//   },
//   {
//     id: 5,
//     title: 'Brown Noise',
//     mood: 'Deep Focus',
//     emoji: '🦗',
//     gradient: 'from-indigo-200 to-purple-300',
//     soundType: 'brown',
//   },
//   {
//     id: 6,
//     title: 'Thunderstorm',
//     mood: 'Cozy & Peaceful',
//     emoji: '⛈️',
//     gradient: 'from-gray-300 to-purple-300',
//     soundType: 'thunder',
//   },
//   {
//     id: 7,
//     title: 'Gentle Stream',
//     mood: 'Natural Flow',
//     emoji: '💧',
//     gradient: 'from-cyan-100 to-blue-200',
//     soundType: 'stream',
//   },
//   {
//     id: 8,
//     title: 'Wind in Trees',
//     mood: 'Light & Airy',
//     emoji: '🍃',
//     gradient: 'from-green-100 to-teal-200',
//     soundType: 'wind',
//   },
// ];

// // Advanced audio generator using Web Audio API to create realistic ambient sounds
// class AmbientAudioGenerator {
//   private audioContext: AudioContext | null = null;
//   private gainNode: GainNode | null = null;
//   private sources: AudioBufferSourceNode[] = [];
//   private oscillators: OscillatorNode[] = [];
//   private filters: BiquadFilterNode[] = [];

//   initialize() {
//     if (!this.audioContext) {
//       this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
//       this.gainNode = this.audioContext.createGain();
//       this.gainNode.connect(this.audioContext.destination);
//     }
//   }

//   stop() {
//     // Stop all sources
//     this.sources.forEach(source => {
//       try {
//         source.stop();
//         source.disconnect();
//       } catch (e) {}
//     });
//     this.sources = [];

//     // Stop all oscillators
//     this.oscillators.forEach(osc => {
//       try {
//         osc.stop();
//         osc.disconnect();
//       } catch (e) {}
//     });
//     this.oscillators = [];

//     // Disconnect all filters
//     this.filters.forEach(filter => {
//       try {
//         filter.disconnect();
//       } catch (e) {}
//     });
//     this.filters = [];
//   }

//   private generateNoiseBuffer(type: 'white' | 'pink' | 'brown'): AudioBuffer {
//     const bufferSize = this.audioContext!.sampleRate * 2;
//     const buffer = this.audioContext!.createBuffer(1, bufferSize, this.audioContext!.sampleRate);
//     const data = buffer.getChannelData(0);

//     switch (type) {
//       case 'white':
//         for (let i = 0; i < bufferSize; i++) {
//           data[i] = Math.random() * 2 - 1;
//         }
//         break;
//       case 'pink':
//         let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
//         for (let i = 0; i < bufferSize; i++) {
//           const white = Math.random() * 2 - 1;
//           b0 = 0.99886 * b0 + white * 0.0555179;
//           b1 = 0.99332 * b1 + white * 0.0750759;
//           b2 = 0.96900 * b2 + white * 0.1538520;
//           b3 = 0.86650 * b3 + white * 0.3104856;
//           b4 = 0.55000 * b4 + white * 0.5329522;
//           b5 = -0.7616 * b5 - white * 0.0168980;
//           data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
//           b6 = white * 0.115926;
//         }
//         break;
//       case 'brown':
//         let lastOut = 0;
//         for (let i = 0; i < bufferSize; i++) {
//           const white = Math.random() * 2 - 1;
//           data[i] = (lastOut + (0.02 * white)) / 1.02;
//           lastOut = data[i];
//           data[i] *= 3.5;
//         }
//         break;
//     }

//     return buffer;
//   }

//   play(soundType: string) {
//     if (!this.audioContext || !this.gainNode) return;

//     this.stop();

//     switch (soundType) {
//       case 'white':
//       case 'pink':
//       case 'brown':
//         this.playSimpleNoise(soundType);
//         break;
//       case 'rain':
//         this.playRain();
//         break;
//       case 'waves':
//         this.playWaves();
//         break;
//       case 'wind':
//         this.playWind();
//         break;
//       case 'stream':
//         this.playStream();
//         break;
//       case 'thunder':
//         this.playThunder();
//         break;
//     }
//   }

//   private playSimpleNoise(type: 'white' | 'pink' | 'brown') {
//     const buffer = this.generateNoiseBuffer(type);
//     const source = this.audioContext!.createBufferSource();
//     source.buffer = buffer;
//     source.loop = true;
//     source.connect(this.gainNode!);
//     source.start(0);
//     this.sources.push(source);
//   }

//   private playRain() {
//     // Rain = filtered brown noise + random droplets
//     const buffer = this.generateNoiseBuffer('brown');
//     const source = this.audioContext!.createBufferSource();
//     source.buffer = buffer;
//     source.loop = true;

//     // Low-pass filter for rain sound
//     const filter = this.audioContext!.createBiquadFilter();
//     filter.type = 'lowpass';
//     filter.frequency.value = 1200;
//     filter.Q.value = 1;

//     source.connect(filter);
//     filter.connect(this.gainNode!);
//     source.start(0);

//     this.sources.push(source);
//     this.filters.push(filter);
//   }

//   private playWaves() {
//     // Waves = brown noise + slow LFO modulation
//     const buffer = this.generateNoiseBuffer('brown');
//     const source = this.audioContext!.createBufferSource();
//     source.buffer = buffer;
//     source.loop = true;

//     // Create amplitude modulation for wave effect
//     const modulationGain = this.audioContext!.createGain();
//     const lfo = this.audioContext!.createOscillator();
//     lfo.frequency.value = 0.2; // Slow wave rhythm
//     lfo.type = 'sine';

//     const lfoGain = this.audioContext!.createGain();
//     lfoGain.gain.value = 0.4;

//     lfo.connect(lfoGain);
//     lfoGain.connect(modulationGain.gain);
    
//     source.connect(modulationGain);
//     modulationGain.connect(this.gainNode!);
    
//     source.start(0);
//     lfo.start(0);

//     this.sources.push(source);
//     this.oscillators.push(lfo);
//   }

//   private playWind() {
//     // Wind = filtered pink noise with slow modulation
//     const buffer = this.generateNoiseBuffer('pink');
//     const source = this.audioContext!.createBufferSource();
//     source.buffer = buffer;
//     source.loop = true;

//     // Band-pass filter for wind
//     const filter = this.audioContext!.createBiquadFilter();
//     filter.type = 'bandpass';
//     filter.frequency.value = 800;
//     filter.Q.value = 0.5;

//     // Slow amplitude modulation
//     const modulationGain = this.audioContext!.createGain();
//     const lfo = this.audioContext!.createOscillator();
//     lfo.frequency.value = 0.15;
//     lfo.type = 'sine';

//     const lfoGain = this.audioContext!.createGain();
//     lfoGain.gain.value = 0.3;

//     lfo.connect(lfoGain);
//     lfoGain.connect(modulationGain.gain);

//     source.connect(filter);
//     filter.connect(modulationGain);
//     modulationGain.connect(this.gainNode!);

//     source.start(0);
//     lfo.start(0);

//     this.sources.push(source);
//     this.oscillators.push(lfo);
//     this.filters.push(filter);
//   }

//   private playStream() {
//     // Stream = high-pass filtered white noise
//     const buffer = this.generateNoiseBuffer('white');
//     const source = this.audioContext!.createBufferSource();
//     source.buffer = buffer;
//     source.loop = true;

//     // High-pass filter for bubbling stream
//     const filter = this.audioContext!.createBiquadFilter();
//     filter.type = 'highpass';
//     filter.frequency.value = 400;
//     filter.Q.value = 0.8;

//     source.connect(filter);
//     filter.connect(this.gainNode!);
//     source.start(0);

//     this.sources.push(source);
//     this.filters.push(filter);
//   }

//   private playThunder() {
//     // Thunder = brown noise + pink noise + occasional rumbles
//     const brownBuffer = this.generateNoiseBuffer('brown');
//     const brownSource = this.audioContext!.createBufferSource();
//     brownSource.buffer = brownBuffer;
//     brownSource.loop = true;

//     const filter = this.audioContext!.createBiquadFilter();
//     filter.type = 'lowpass';
//     filter.frequency.value = 800;

//     brownSource.connect(filter);
//     filter.connect(this.gainNode!);
//     brownSource.start(0);

//     this.sources.push(brownSource);
//     this.filters.push(filter);
//   }

//   setVolume(volume: number) {
//     if (this.gainNode) {
//       this.gainNode.gain.value = volume;
//     }
//   }

//   close() {
//     this.stop();
//     if (this.audioContext) {
//       this.audioContext.close();
//       this.audioContext = null;
//     }
//   }
// }

// export function MusicPlayer() {
//   const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [volume, setVolume] = useState([70]);
//   const audioGeneratorRef = useRef<AmbientAudioGenerator | null>(null);

//   // Initialize audio generator
//   useEffect(() => {
//     audioGeneratorRef.current = new AmbientAudioGenerator();
//     return () => {
//       audioGeneratorRef.current?.close();
//     };
//   }, []);

//   // Handle track and playback changes
//   useEffect(() => {
//     const generator = audioGeneratorRef.current;
//     if (!generator) return;

//     generator.initialize();

//     if (isPlaying && selectedTrack) {
//       generator.play(selectedTrack.soundType);
//       generator.setVolume(volume[0] / 100);
//     } else {
//       generator.stop();
//     }
//   }, [isPlaying, selectedTrack]);

//   // Handle volume changes
//   useEffect(() => {
//     audioGeneratorRef.current?.setVolume(volume[0] / 100);
//   }, [volume]);

//   const handleTrackSelect = (track: Track) => {
//     if (selectedTrack?.id === track.id) {
//       setIsPlaying(!isPlaying);
//     } else {
//       setSelectedTrack(track);
//       setIsPlaying(true);
//     }
//   };

//   return (
//     <div className="flex flex-col">
//       {/* Now Playing Card */}
//       {selectedTrack && (
//         < div

//           className={`mb-8 p-8 rounded-3xl bg-gradient-to-br ${selectedTrack.gradient} shadow-xl relative overflow-hidden`}
//         >
//           {/* Subtle background glow */}
//           <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--color-card)] opacity-30 rounded-full blur-3xl" />

//           <div className="relative z-10 text-center">
//             <div className="text-6xl mb-4">
//               {selectedTrack.emoji}
//             </div>
            
//             <h2 className="mb-1 text-white">{selectedTrack.title}</h2>
//             <p className="text-sm text-white/80 mb-6">{selectedTrack.mood}</p>

//             {/* Play/Pause Control */}
//             <div className="flex items-center justify-center gap-4">
//               <button
//                 onPointerDown={(e) => {
//                   e.preventDefault();
//                   setIsPlaying(!isPlaying);
//                 }}
//                 className="w-20 h-20 rounded-full bg-[var(--color-card)] text-lavender-600 shadow-lg flex items-center justify-center touch-manipulation active:scale-95 transition-transform"
//               >
//                 {isPlaying ? (
//                   <Pause size={32} fill="currentColor" />
//                 ) : (
//                   <Play size={32} fill="currentColor" className="ml-1" />
//                 )}
//               </button>
//             </div>

//             {/* Volume Control */}
//             <div className="mt-6 flex items-center gap-3 max-w-xs mx-auto">
//               <Volume2 size={20} className="text-white/80" />
//               <Slider
//                 value={volume}
//                 onValueChange={setVolume}
//                 max={100}
//                 step={1}
//                 className="flex-1"
//               />
//               <span className="text-sm text-white/80 w-10 text-right">{volume[0]}%</span>
//             </div>
//           </div>
//         </ div>
//       )}

//       {/* Track Selection Grid */}
//       <div className="grid grid-cols-2 gap-3">
//         {tracks.map((track) => {
//           const isSelected = selectedTrack?.id === track.id;
//           const isCurrentlyPlaying = isSelected && isPlaying;

//           return (
//             < button
//               key={track.id}
//               //whileHover={{ scale: 1.02 }}
//               //whileTap={{ scale: 0.98 }}
//               onClick={() => handleTrackSelect(track)}
//               className={`p-5 rounded-3xl bg-gradient-to-br ${track.gradient} shadow-md hover:shadow-xl transition-all duration-300 text-left relative ${
//                 isSelected ? 'ring-4 ring-white shadow-2xl' : ''
//               }`}
//             >
//               <div className="text-4xl mb-3">
//                 {track.emoji}
//               </div>
              
//               <h3 className="text-white mb-1">{track.title}</h3>
//               <p className="text-xs text-white/80">{track.mood}</p>

//               {/* Playing indicator */}
//               {isCurrentlyPlaying && (
//                 < div

//                   className="mt-2 text-xs text-white flex items-center gap-1.5"
//                 >
//                   <span

//                   >
//                     ▸
//                   </span>
//                   Playing
//                 </ div>
//               )}
//             </ button>
//           );
//         })}
//       </div>

//       {/* Helper text */}
//       {!selectedTrack && (
//         <p

//           className="mt-8 text-center"
//         >
//           Select a sound to begin your focus session
//         </p>
//       )}
//     </div>
//   );
// }
