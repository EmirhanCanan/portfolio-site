export async function onRequestGet(context) {
  const publicCode = "6a8f0b098f40bb135087466e";
  try {
    const response = await fetch(`http://dreamlo.com/lb/${publicCode}/json`);
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestPost(context) {
  const privateCode = "osG_H6Iu9EGxrrcUmMVELAiuUaUewLBkmYorvUhJA8uA";
  
  try {
    const body = await context.request.json();
    const { name, score } = body;
    
    if (!name || typeof score !== 'number') {
      return new Response("Invalid body", { status: 400 });
    }
    
    const safeName = name.replace(/ /g, '_');
    
    const response = await fetch(`http://dreamlo.com/lb/${privateCode}/add/${safeName}/${score}`);
    const text = await response.text();
    
    return new Response(JSON.stringify({ success: true, result: text }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
