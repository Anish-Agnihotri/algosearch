import numeral from 'numeral';

export function formatValue(number) {
	return numeral(number).format('0,0.[0000000000]');
}

export const siteName = "https://algosearch.io";
