import "node-yahoo";
import fs from 'fs';

const get_ticker_url = (ticker: string) => (
    `https://query2.finance.yahoo.com/v11/finance/quoteSummary/${ticker}?modules=summaryDetail`
)

const get_google_rss_url = (ticker: string) => (
    `http://news.google.com/news?q=${ticker}+stock&output=rss`
)

const load_stock_list = () => {
    let raw = fs.readFileSync('student.json').toString();
    return JSON.parse(raw)
}

/*
 * This needs to be loaded only once, (preferrably) on server side.
 * Not sure how that will work with NextJS.
*/
const stock_data = load_stock_list();

/*
 * Returns a promise containing the stock's RSS feed from Google News.'
 * May not be working right now.
*/
const get_news_by_ticker = (ticker: string) => (
    fetch(get_google_rss_url(ticker))
        .then((response: Response) => response.text())
)

/*
 * Returns a promise containing the stock's data from Yahoo Finance.
*/
const get_stock_data = (ticker: string) => (
    fetch(get_ticker_url(ticker))
        .then((response: Response) => response.json())
)

// Apparently enums are bad, so this is a better enum? No idea.
type Source = "nyse" | "nasdaq" | "amex" | "asx"

/*
 * Selects sources listed in `sources`, and returns an array of stocks under that sector.
*/
const get_tickers = (sources: Array<Source>, sector = "") => (
    stock_data
        .filter((source: any) => (
            sources.includes(source.name as Source)) &&
            Object.keys(source.sectors).includes(sector)
        )
        .map((source: any) => (source.sectors[sector]))
        .reduce((acc: Array<string>, ls: Array<string>) => acc.concat(ls))
)

// Sectors we don;t want showing up in the list.
const sector_blocklist: Array<string> = [
    "n/a",
];

// I hope this works.
const unique = (arr: Array<any>): Array<any> => (
    arr.filter((v, i, a) => a.indexOf(v) === i)
)

const choose_one = (arr: Array<any>): Array<any> => (
    arr[Math.floor(Math.random() * arr.length)]
)

const get_rand_ticker = (source: Source, sector: string) => (
    choose_one(get_tickers([source], sector))
)

const list_sectors = (): Array<string> => (
    unique(
    stock_data
        .map((source: any) => Object.keys(source.sectors))
        .reduce((acc: Array<string>, ls: Array<string>) => acc.concat(ls))
    ).filter((sector) => !sector_blocklist.includes(sector))
)

export {}
