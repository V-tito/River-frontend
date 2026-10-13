/**
 * minimal amount of info about a signal you need to trigger it in protocol;
 * might add isOutput for extra error checking
 * for now it should be ensured in components that the signal is compatible with a command being triggered
 */
export interface MinimalSignal {
	parentGroup: string;
	name: string;
}
export function ValidateMinimalSignal(entry: unknown): entry is MinimalSignal {
	return (
		typeof entry === 'object' &&
		typeof (entry as MinimalSignal).parentGroup === 'string' &&
		typeof (entry as MinimalSignal).name === 'string'
	);
}
