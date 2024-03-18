import isBrowser from '@/Hooks/utils/isBrowser';

export default function isDocumentVisible(): boolean {
	if (isBrowser) {
		return document.visibilityState !== 'hidden';
	}
	return true;
}
