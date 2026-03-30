const NOTIFICATION_SOUND_PATH = '/sounds/notification.wav';

export function playNotificationSound(): void {
  try {
    const audio = new Audio(NOTIFICATION_SOUND_PATH);
    audio.play().catch(() => {
      // Browser may block autoplay before user interaction
    });
  } catch {
    // Audio not supported
  }
}
