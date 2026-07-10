import Link from "next/link";
export default function NotFound(){return <main className="empty-state"><span>Erro 404</span><h1>Esta página não foi encontrada.</h1><p>O endereço pode ter mudado ou ainda não estar disponível nesta fase.</p><Link className="button" href="/">Voltar ao início</Link></main>}
