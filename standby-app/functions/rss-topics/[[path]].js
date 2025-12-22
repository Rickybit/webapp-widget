export async function onRequest(context) {
    const { request, params } = context;
    const url = new URL(request.url);

    // Extract the path after /rss-topics/
    // params.path is an array because of [[path]].js
    const path = params.path ? params.path.join('/') : '';

    // Construct the Yahoo RSS URL
    // Vite config was: rewrite: (path) => path.replace(/^\/rss-topics/, '/rss/topics')
    const targetUrl = `https://news.yahoo.co.jp/rss/topics/${path}`;

    console.log('Proxying request to:', targetUrl);

    try {
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': request.headers.get('User-Agent') || 'Cloudflare-Proxy'
            }
        });

        // Return the response with proper headers, especially CORS if needed
        // Cloudflare Functions are on the same domain as Pages, so CORS isn't strictly needed for fetch(),
        // but good to keep the headers from the source.
        const newResponse = new Response(response.body, response);
        newResponse.headers.set('Access-Control-Allow-Origin', '*');

        return newResponse;
    } catch (error) {
        return new Response(`Error fetching RSS: ${error.message}`, { status: 500 });
    }
}
