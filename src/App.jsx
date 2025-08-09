import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { motion } from 'framer-motion'

export default function App() {
  const [items, setItems] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [query, setQuery] = useState('')
  const [form, setForm] = useState({ title: '', cover: '', desc: '', links: '', tags: '' })

  useEffect(() => {
    const saved = localStorage.getItem('zona_items')
    if (saved) setItems(JSON.parse(saved))
    else {
      // Ejemplo inicial
      const demo = [{
        id: Date.now(),
        title: 'Pulse Edge — Episodio 01',
        cover: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=60',
        desc: 'Un piloto cyberpunk en un mundo virtual inspirado en SAO. (Ejemplo de demo)',
        links: [{ name: 'Google Drive', url: 'https://drive.google.com/example' }],
        tags: ['Acción','Sci-Fi']
      }]
      setItems(demo)
      localStorage.setItem('zona_items', JSON.stringify(demo))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('zona_items', JSON.stringify(items))
  }, [items])

  function handleAdd(e) {
    e.preventDefault()
    if (!form.title) return alert('El anime necesita un título.')
    const links = form.links.split('\n').map(l=>l.trim()).filter(Boolean).map(l=>{
      if (l.includes('|')) { const [name,url]=l.split('|').map(s=>s.trim()); return {name,url} }
      return {name:'Enlace', url:l}
    })
    const tags = form.tags.split(',').map(t=>t.trim()).filter(Boolean)
    const newItem = { id: Date.now(), title: form.title, cover: form.cover||'https://via.placeholder.com/420x240?text=Cover', desc: form.desc, links, tags }
    setItems(s=>[newItem, ...s])
    setForm({ title: '', cover: '', desc: '', links: '', tags: '' })
    setShowForm(false)
  }

  function handleRemove(id) {
    if (!confirm('¿Eliminar este item?')) return
    setItems(s=>s.filter(i=>i.id!==id))
  }

  const filtered = items.filter(it => it.title.toLowerCase().includes(query.toLowerCase()) || it.tags.join(' ').toLowerCase().includes(query.toLowerCase()) || it.desc.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="min-h-screen p-6">
      <Helmet>
        <title>ZonaPuschamon — Interfaz SAO</title>
        <meta name="description" content="ZonaPuschamon: portal futurista estilo SAO para fans de anime." />
        <meta property="og:image" content="https://via.placeholder.com/420x240?text=ZonaPuschamon" />
      </Helmet>

      <header className="max-w-6xl mx-auto flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-sao-neon">ZonaPuschamon</h1>
          <p className="text-sm text-gray-300 mt-1">Interfaz futurista — estilo SAO. Añade tus enlaces legales.</p>
        </div>
        <div className="flex gap-3 items-center">
          <input aria-label="Buscar" placeholder="Buscar..." value={query} onChange={e=>setQuery(e.target.value)} className="px-3 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none"/>
          <button onClick={()=>setShowForm(s=>!s)} className="px-4 py-2 bg-gradient-to-r from-sao-blue to-sao-neon rounded-md font-medium neon-glow">{showForm? 'Cancelar':'Agregar'}</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="bg-yellow-200/10 border border-yellow-300/10 p-4 rounded-md mb-6">
          <strong className="text-yellow-300">Aviso legal:</strong>
          <span className="text-sm text-gray-300 ml-2">Enlaza solo a contenido que tengas derecho a compartir.</span>
        </div>

        {showForm && (
          <motion.form initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} onSubmit={handleAdd} className="bg-gray-800/40 p-4 rounded-md mb-6 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={form.title} onChange={e=>setForm(f=>({...f, title:e.target.value}))} placeholder="Título" className="p-2 rounded bg-gray-900 border border-gray-700" required/>
              <input value={form.cover} onChange={e=>setForm(f=>({...f, cover:e.target.value}))} placeholder="URL de portada (opcional)" className="p-2 rounded bg-gray-900 border border-gray-700"/>
              <textarea value={form.desc} onChange={e=>setForm(f=>({...f, desc:e.target.value}))} placeholder="Descripción breve" className="p-2 rounded bg-gray-900 border border-gray-700 md:col-span-2"/>
              <textarea value={form.links} onChange={e=>setForm(f=>({...f, links:e.target.value}))} placeholder={'Lista de enlaces (uno por línea). Usa "Nombre|URL" para un nombre legible.'} className="p-2 rounded bg-gray-900 border border-gray-700 md:col-span-2"/>
              <input value={form.tags} onChange={e=>setForm(f=>({...f, tags:e.target.value}))} placeholder="Tags (separados por comas)" className="p-2 rounded bg-gray-900 border border-gray-700"/>
            </div>

            <div className="mt-3 flex gap-3">
              <button className="px-4 py-2 bg-green-600 rounded">Guardar</button>
              <button type="button" onClick={()=>setShowForm(false)} className="px-4 py-2 bg-gray-700 rounded">Cancelar</button>
            </div>
          </motion.form>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(it=>(
            <motion.article key={it.id} whileHover={{scale:1.02}} className="bg-gradient-to-b from-gray-800/60 to-black rounded-2xl overflow-hidden border border-gray-700 shadow-lg neon-glow">
              <div className="relative h-44 w-full">
                <img src={it.cover} alt={it.title} className="object-cover w-full h-full"/>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-lg truncate text-sao-neon">{it.title}</h3>
                <p className="text-sm text-gray-300 mt-1 line-clamp-3">{it.desc}</p>

                <div className="flex flex-wrap gap-2 mt-3">{it.tags.map((t,i)=>(<span key={i} className="text-xs px-2 py-1 bg-gradient-to-r from-sao-blue to-sao-neon rounded-full">{t}</span>))}</div>

                <div className="mt-4 flex gap-2">
                  {it.links[0] && (<a href={it.links[0].url} target="_blank" rel="noreferrer" className="flex-1 text-center px-3 py-2 bg-gradient-to-r from-sao-blue to-sao-neon rounded-md">Ver / Descargar</a>)}
                  <div className="flex-1 text-center px-3 py-2 bg-gray-700 rounded-md relative">
                    <details className="text-sm"><summary>Más enlaces</summary>
                      <ul className="mt-2 text-xs">{it.links.map((l,idx)=>(<li key={idx} className="mt-1"><a href={l.url} target="_blank" rel="noreferrer" className="underline">{l.name}</a></li>))}</ul>
                    </details>
                  </div>
                </div>

                <div className="mt-3 flex justify-between items-center"><small className="text-xs text-gray-400">ID: {String(it.id).slice(-6)}</small><button onClick={()=>handleRemove(it.id)} className="text-xs px-2 py-1 bg-red-700 rounded">Eliminar</button></div>
              </div>
            </motion.article>
          ))}
        </section>

        {filtered.length===0 && (<p className="text-center text-gray-400 mt-10">No se encontraron resultados. Agrega nuevos items con el botón "Agregar".</p>)}

        <footer className="mt-12 text-center text-sm text-gray-500">ZonaPuschamon — Interfaz futurista creada para fans.</footer>
      </main>
    </div>
  )
}
