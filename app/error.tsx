"use client";
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="empty-state"><span>Algo deu errado</span><h1>Não foi possível carregar esta área.</h1><p>Nenhum dado foi apagado. Tente carregar novamente.</p><button className="button" onClick={reset} type="button">Tentar novamente</button></main>}
