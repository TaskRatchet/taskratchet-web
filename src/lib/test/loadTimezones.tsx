import { getTimezones } from '@taskratchet/sdk';
import { vi } from 'vitest';

export function loadTimezones(timezones: string[] = []): void {
	vi.mocked(getTimezones).mockResolvedValue(timezones);
}
