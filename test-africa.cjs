const yahooFinance = require('yahoo-finance2').default;

async function testAfricaTickers() {
    const tickers = [
        'MTNN.LG', // Nigeria
        'ZENITHBA.LG', // Nigeria
        'MTNGH.GH', // Ghana (Guessing suffix)
        'SOL.J', // South Africa
        'ABL.J', // South Africa
    ];

    for (const ticker of tickers) {
        try {
            console.log(`\nTesting ${ticker}...`);
            const result = await yahooFinance.quote(ticker);
            console.log(`- Success: ${result.longName || result.shortName} | Price: ${result.regularMarketPrice} ${result.currency}`);
        } catch (e) {
            console.log(`- Failed: ${ticker} - ${e.message}`);
        }
    }
}

testAfricaTickers();
