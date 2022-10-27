import { getTimezones } from '../api/getTimezones';
import { vi } from 'vitest';

export function loadTimezones(timezones: string[] = []): void {
	vi.mocked(getTimezones).mockResolvedValue(timezones);
}
