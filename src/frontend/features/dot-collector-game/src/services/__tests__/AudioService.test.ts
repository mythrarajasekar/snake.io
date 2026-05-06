import { AudioService } from '../AudioService';

describe('AudioService', () => {
  it('toggles mute state', () => {
    const initialMuted = AudioService.isMuted();
    AudioService.setMuted(!initialMuted);
    expect(AudioService.isMuted()).toBe(!initialMuted);
    AudioService.setMuted(initialMuted);
  });

  it('plays sound effects without error', () => {
    expect(() => AudioService.play('collect')).not.toThrow();
    expect(() => AudioService.play('collectRare')).not.toThrow();
    expect(() => AudioService.play('collectBonus')).not.toThrow();
    expect(() => AudioService.play('lifeLost')).not.toThrow();
    expect(() => AudioService.play('gameOver')).not.toThrow();
  });

  it('starts and stops music without error', () => {
    expect(() => AudioService.startMusic()).not.toThrow();
    expect(() => AudioService.stopMusic()).not.toThrow();
  });
});
