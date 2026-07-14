import { useState, useEffect, useMemo } from 'react';
import { Search, Heart, Trash2, Edit2, AlertCircle, Loader2, Save, X, ChevronDown, Database, Activity, MapPin, Tv, Dna, Eye, ShieldAlert, Fingerprint } from 'lucide-react';

// ============================================================================
// 1. TIPOS E INTERFACES 
// ============================================================================

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
  origin: { name: string };
  gender: string;
  location: { name: string };
  episode: string[];
  type: string;
}

// Actualizamos la interfaz para incluir la 'info' de paginación que manda la API
interface ApiResponse {
  info: {
    next: string | null;
    pages: number;
    count: number;
  };
  results: Character[];
}

interface FavoriteCharacter extends Character {
  notaPersonal: string;
  calificacion: number;
}

// ============================================================================
// 2. COMPONENTES HIJOS
// ============================================================================

const ModalDetalle = ({ personaje, alCerrar }: { personaje: Character; alCerrar: () => void }) => {
  // Generador de "Dato Curioso" basado en las características del personaje
  const generarDatoCurioso = (p: Character) => {
    if (p.episode.length > 40) return "⚠️ ANOMALÍA: Sujeto de altísima frecuencia. Detectado en múltiples líneas temporales. Riesgo de colapso multiversal por sobreexposición.";
    if (p.status === 'Dead') return "💀 EXPEDIENTE CERRADO: Sujeto neutralizado en su dimensión de origen. Se desconoce si existen clones viables.";
    if (p.species.includes('Alien')) return "👽 CLASIFICACIÓN PENDIENTE: Biología no registrada por la Federación Galáctica. Requiere análisis de tejidos.";
    if (p.origin.name === 'unknown') return "❓ ORIGEN BORRADO: Los registros del origen de este sujeto han sido eliminados o censurados de la base de datos central.";
    if (p.type !== '') return `🧬 VARIANTE DETECTADA: Sub-clasificación genómica registrada como "${p.type}". Posible mutación inducida.`;
    return "📄 SUJETO ESTÁNDAR: Civil sin alteraciones multiversales. Nivel de amenaza calculado: Bajo.";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Fondo oscuro con desenfoque */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={alCerrar}></div>
      
      {/* Contenedor del Modal */}
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-green-500/50 rounded-2xl shadow-[0_0_40px_rgba(34,197,94,0.2)] overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
        
        {/* Botón Cerrar */}
        <button onClick={alCerrar} className="absolute top-4 right-4 z-10 p-2 bg-slate-950/50 hover:bg-red-500/20 text-slate-300 hover:text-red-400 rounded-full transition-colors backdrop-blur-md">
          <X className="w-5 h-5" />
        </button>

        {/* Columna Izquierda: Imagen */}
        <div className="w-full md:w-2/5 h-64 md:h-auto relative">
          <img src={personaje.image} alt={personaje.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent md:bg-gradient-to-r md:from-transparent md:to-slate-900"></div>
          <div className="absolute bottom-4 left-4 bg-slate-950/80 px-3 py-1 rounded-lg border border-green-500/30 flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-mono font-bold text-sm">ID-{personaje.id.toString().padStart(4, '0')}</span>
          </div>
        </div>

        {/* Columna Derecha: Información */}
        <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col max-h-[80vh] overflow-y-auto">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight flex items-center gap-3">
            {personaje.name}
          </h2>
          
          <div className="flex items-center gap-3 mb-6 bg-slate-800/50 w-fit px-4 py-2 rounded-xl border border-slate-700">
            <span className={`w-3 h-3 rounded-full ${personaje.status === 'Alive' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]' : personaje.status === 'Dead' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-slate-400'}`}></span>
            <span className="text-slate-200 font-bold tracking-wide uppercase text-sm">{personaje.status}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 font-medium">{personaje.species}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
              <p className="text-xs text-slate-500 uppercase font-bold mb-1 flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Dimensión Origen</p>
              <p className="text-sm text-slate-200 font-medium">{personaje.origin.name}</p>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
              <p className="text-xs text-slate-500 uppercase font-bold mb-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Ubicación Actual</p>
              <p className="text-sm text-slate-200 font-medium">{personaje.location.name}</p>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
              <p className="text-xs text-slate-500 uppercase font-bold mb-1 flex items-center gap-1.5"><Dna className="w-3.5 h-3.5" /> Género / Subtipo</p>
              <p className="text-sm text-slate-200 font-medium">{personaje.gender} {personaje.type && `(${personaje.type})`}</p>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
              <p className="text-xs text-slate-500 uppercase font-bold mb-1 flex items-center gap-1.5"><Tv className="w-3.5 h-3.5" /> Apariciones</p>
              <p className="text-sm text-slate-200 font-medium">{personaje.episode.length} Episodios registrados</p>
            </div>
          </div>

          <div className="mt-auto bg-green-950/30 border border-green-500/30 p-4 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
            <h4 className="text-green-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Expediente Clasificado
            </h4>
            <p className="text-sm text-slate-300 font-mono leading-relaxed">
              {generarDatoCurioso(personaje)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Buscador = ({ 
  busqueda, setBusqueda, filtroEstado, setFiltroEstado 
}: { 
  busqueda: string; setBusqueda: (b: string) => void;
  filtroEstado: string; setFiltroEstado: (f: string) => void;
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-slate-700/50">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-green-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-4 py-3 border border-slate-600/50 rounded-xl bg-slate-900/80 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          placeholder="Rastrear sujeto por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>
      <select
        value={filtroEstado}
        onChange={(e) => setFiltroEstado(e.target.value)}
        className="block w-full sm:w-56 pl-4 pr-10 py-3 text-base border border-slate-600/50 rounded-xl bg-slate-900/80 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all cursor-pointer"
      >
        <option value="Todos">Signos vitales: Todos</option>
        <option value="Alive">🟢 Vivo</option>
        <option value="Dead">🔴 Fallecido</option>
        <option value="unknown">⚪ Desconocido</option>
      </select>
    </div>
  );
};

const ElementoCard = ({ 
  personaje, alAgregarFavorito, esFavorito, alInspeccionar 
}: { 
  personaje: Character; alAgregarFavorito: (p: Character) => void; esFavorito: boolean; alInspeccionar: (p: Character) => void;
}) => {
  // Colores dinámicos según el estado
  const statusColor = personaje.status === 'Alive' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]' 
                    : personaje.status === 'Dead' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]' 
                    : 'bg-slate-400';

  return (
    <div className="group bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_0_25px_rgba(74,222,128,0.15)] transition-all duration-300 border border-slate-700 hover:border-green-500/50 flex flex-col h-full relative">
      {/* Etiqueta ID estilo Pokédex */}
      <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-mono text-green-400 font-bold z-10 border border-green-500/30">
        #{personaje.id.toString().padStart(3, '0')}
      </div>

      <div className="relative overflow-hidden">
        <img 
          src={personaje.image} 
          alt={personaje.name} 
          className="w-full h-64 object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
      </div>

      <div className="p-5 flex-1 flex flex-col relative z-10 -mt-8">
        <h3 className="text-2xl font-black text-white mb-3 tracking-tight drop-shadow-md truncate" title={personaje.name}>
          {personaje.name}
        </h3>
        
        <div className="bg-slate-900/50 rounded-xl p-3 mb-4 flex-1 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <span className={`w-2.5 h-2.5 rounded-full ${statusColor}`}></span>
            <span className="text-sm font-medium text-slate-300">{personaje.status} • {personaje.species}</span>
          </div>
          <div className="flex items-start gap-2 mt-2">
            <Database className="w-4 h-4 text-slate-500 mt-0.5" />
            <p className="text-xs text-slate-400">
              <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-0.5">Origen detectado</span>
              <span className="truncate block max-w-[200px]" title={personaje.origin?.name}>{personaje.origin?.name || 'Desconocido'}</span>
            </p>
          </div>

          {}
          <div className="grid grid-cols-2 gap-y-2 mt-3 pt-3 border-t border-slate-700/50">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400" title={`Género: ${personaje.gender}`}>
              <Dna className="w-3.5 h-3.5 text-blue-400" />
              <span className="truncate">{personaje.gender} {personaje.type && `(${personaje.type})`}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400" title={`${personaje.episode?.length || 0} apariciones en episodios`}>
              <Tv className="w-3.5 h-3.5 text-purple-400" />
              <span>{personaje.episode?.length || 0} Episodios</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 col-span-2 mt-1" title={`Ubicación actual: ${personaje.location?.name}`}>
              <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span className="truncate">Actual: {personaje.location?.name || 'Desconocida'}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => alInspeccionar(personaje)}
            className="flex-1 py-3 px-2 rounded-xl flex items-center justify-center gap-1.5 font-bold transition-all duration-200 bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 hover:border-slate-400 shadow-md active:scale-95 text-xs sm:text-sm"
            title="Abrir expediente completo"
          >
            <Eye className="w-4 h-4" /> Inspeccionar
          </button>
          
          <button
            onClick={() => alAgregarFavorito(personaje)}
            disabled={esFavorito}
            className={`flex-[1.5] py-3 px-2 rounded-xl flex items-center justify-center gap-1.5 font-bold transition-all duration-200 text-xs sm:text-sm ${
              esFavorito 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                : 'bg-green-500 hover:bg-green-400 text-slate-900 shadow-[0_0_15px_rgba(74,222,128,0.3)] hover:shadow-[0_0_25px_rgba(74,222,128,0.5)] active:scale-95'
            }`}
          >
            <Heart className={`w-4 h-4 ${esFavorito ? 'fill-slate-500' : ''}`} />
            {esFavorito ? 'Guardado' : 'Capturar'}
          </button>
        </div>
      </div>
    </div>
  );
};

const FavoritoCard = ({ 
  favorito, alEliminar, alActualizar 
}: { 
  favorito: FavoriteCharacter; alEliminar: (id: number) => void; alActualizar: (id: number, n: string, c: number) => void;
}) => {
  const [editando, setEditando] = useState(false);
  const [notaTemp, setNotaTemp] = useState(favorito.notaPersonal);
  const [califTemp, setCalifTemp] = useState(favorito.calificacion);

  return (
    <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-indigo-500/30 flex flex-col sm:flex-row hover:border-indigo-400/60 transition-colors">
      <div className="relative sm:w-48">
        <img src={favorito.image} alt={favorito.name} className="w-full h-48 sm:h-full object-cover" />
        <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur px-2 py-1 rounded text-xs font-mono text-indigo-400 border border-indigo-500/30">
          #{favorito.id.toString().padStart(3, '0')}
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-xl font-bold text-white">{favorito.name}</h3>
              {}
              <p className="text-xs text-indigo-300/70 mt-1 flex items-center gap-2">
                <Dna className="w-3 h-3" /> {favorito.species} • {favorito.gender}
              </p>
            </div>
            <button 
              onClick={() => alEliminar(favorito.id)}
              className="text-red-400 hover:text-red-300 p-2 bg-red-400/10 hover:bg-red-400/20 rounded-lg transition-colors"
              title="Borrar de la base de datos"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
          
          {editando ? (
            <div className="space-y-3 mt-2 bg-slate-900/50 p-4 rounded-xl border border-indigo-500/20">
              <div>
                <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Bitácora de investigación:</label>
                <textarea 
                  value={notaTemp} onChange={(e) => setNotaTemp(e.target.value)}
                  className="w-full p-3 text-sm border border-slate-600 rounded-lg bg-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  rows={2} placeholder="Ingresar observaciones anatómicas o de comportamiento..."
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Nivel de amenaza:</label>
                <select 
                  value={califTemp} onChange={(e) => setCalifTemp(Number(e.target.value))}
                  className="p-2 border border-slate-600 rounded-lg text-sm bg-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>Nivel {n}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-3">
                <button 
                  onClick={() => { alActualizar(favorito.id, notaTemp, califTemp); setEditando(false); }} 
                  className="flex-1 bg-indigo-500 text-white py-2 rounded-lg text-sm font-bold hover:bg-indigo-400 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> Guardar
                </button>
                <button 
                  onClick={() => { setNotaTemp(favorito.notaPersonal); setCalifTemp(favorito.calificacion); setEditando(false); }} 
                  className="flex-1 bg-slate-700 text-slate-300 py-2 rounded-lg text-sm font-bold hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" /> Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-2 bg-slate-900/30 p-4 rounded-xl border border-slate-700/50">
              <div className="flex justify-between items-center mb-3">
                <div className="flex gap-1 text-indigo-400">
                  {[...Array(5)].map((_, i) => (
                    <Activity key={i} className={`w-4 h-4 ${i < favorito.calificacion ? 'text-indigo-400' : 'text-slate-600 opacity-30'}`} />
                  ))}
                </div>
                <button 
                  onClick={() => setEditando(true)}
                  className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1 font-bold bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Modificar
                </button>
              </div>
              <p className="text-sm text-slate-400 italic font-mono bg-slate-900/50 p-3 rounded-lg border-l-2 border-indigo-500">
                {favorito.notaPersonal || "> Sin registros en la bitácora. Haga clic en modificar para agregar observaciones."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 3. COMPONENTE PRINCIPAL (App)
// ============================================================================
export default function App() {
  const [datos, setDatos] = useState<Character[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [cargandoMas, setCargandoMas] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  
  // Estado para la Paginación ("Cargar más")
  const [siguienteUrl, setSiguienteUrl] = useState<string | null>(null);
  
  // Estado para la vista de detalle (Modal)
  const [personajeSeleccionado, setPersonajeSeleccionado] = useState<Character | null>(null);

  const [busqueda, setBusqueda] = useState<string>("");
  const [filtroEstado, setFiltroEstado] = useState<string>("Todos");
  const [favoritos, setFavoritos] = useState<FavoriteCharacter[]>([]);
  const [vistaActiva, setVistaActiva] = useState<'explorar' | 'coleccion'>('explorar');

  // EFECTOS (Local Storage)
  useEffect(() => {
    try {
      const guardados = localStorage.getItem("rickMortyPokedex");
      if (guardados) setFavoritos(JSON.parse(guardados));
    } catch (e) { console.error("Error Leyendo Storage", e); }
  }, []);

  useEffect(() => {
    localStorage.setItem("rickMortyPokedex", JSON.stringify(favoritos));
  }, [favoritos]);

  // Función para cargar datos (sirve para la primera carga y para las siguientes)
  const cargarPersonajes = async (url = "https://rickandmortyapi.com/api/character", esCargaAdicional = false) => {
    try {
      if (esCargaAdicional) setCargandoMas(true);
      else setCargando(true);
      setError("");
      
      const respuesta = await fetch(url);
      if (!respuesta.ok) throw new Error(`Anomalía de red: ${respuesta.status}`);
      
      const data: ApiResponse = await respuesta.json();
      
      // Si es "cargar más", sumamos al arreglo existente. Si es primera carga, lo reemplazamos.
      if (esCargaAdicional) {
        setDatos(prev => [...prev, ...data.results]);
      } else {
        setDatos(data.results);
      }
      
      // Guardamos la URL de la siguiente página (si no hay más, la API devuelve null)
      setSiguienteUrl(data.info.next);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de conexión con el multiverso");
    } finally {
      setCargando(false);
      setCargandoMas(false);
    }
  };

  useEffect(() => {
    cargarPersonajes();
  }, []);

  // CRUD Functions
  const agregarAFavoritos = (personaje: Character) => {
    if (!favoritos.some(fav => fav.id === personaje.id)) {
      setFavoritos([...favoritos, { ...personaje, notaPersonal: "", calificacion: 0 }]);
    }
  };
  const eliminarFavorito = (id: number) => setFavoritos(favoritos.filter(f => f.id !== id));
  const actualizarFavorito = (id: number, n: string, c: number) => setFavoritos(favoritos.map(f => f.id === id ? { ...f, notaPersonal: n, calificacion: c } : f));

  // Filtro inteligente
  const datosFiltrados = useMemo(() => {
    return datos.filter(p => {
      const coincideTexto = p.name.toLowerCase().includes(busqueda.toLowerCase());
      const coincideEstado = filtroEstado === "Todos" || p.status === filtroEstado;
      return coincideTexto && coincideEstado;
    });
  }, [datos, busqueda, filtroEstado]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-green-500/30 selection:text-green-200">
      {/* HEADER TIPO PANEL DE CONTROL */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.5)] border border-green-300/30">
                <Database className="w-7 h-7 text-slate-900" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  Portal<span className="text-green-400">Dex</span>
                </h1>
                <p className="text-xs text-green-400/70 font-mono tracking-widest uppercase">Base de datos Multiversal</p>
              </div>
            </div>
            
            <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <button 
                onClick={() => setVistaActiva('explorar')}
                className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ${
                  vistaActiva === 'explorar' 
                    ? 'bg-slate-800 text-green-400 shadow-lg border border-slate-700' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Directorio
              </button>
              <button 
                onClick={() => setVistaActiva('coleccion')}
                className={`px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all duration-300 ${
                  vistaActiva === 'coleccion' 
                    ? 'bg-indigo-600/20 text-indigo-400 shadow-lg border border-indigo-500/30' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sujetos Capturados 
                <span className={`text-xs py-0.5 px-2 rounded-md font-mono ${vistaActiva === 'coleccion' ? 'bg-indigo-500/30' : 'bg-slate-800'}`}>
                  {favoritos.length}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        {/* Efecto de luz de fondo */}
        <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        {/* VISTA 1: EXPLORADOR */}
        {vistaActiva === 'explorar' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
            <Buscador busqueda={busqueda} setBusqueda={setBusqueda} filtroEstado={filtroEstado} setFiltroEstado={setFiltroEstado} />

            {/* ZONA DE ESTADOS */}
            {cargando ? (
              <div className="flex flex-col items-center justify-center py-32 text-green-400">
                <Loader2 className="w-16 h-16 animate-spin mb-6 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                <p className="text-xl font-bold tracking-widest uppercase font-mono animate-pulse">Sincronizando con dimensiones...</p>
              </div>
            ) : error ? (
              <div className="bg-red-950/50 border border-red-500/50 p-8 rounded-2xl flex flex-col items-center text-center max-w-lg mx-auto shadow-2xl backdrop-blur-sm">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]" />
                <h3 className="text-2xl font-black text-white mb-2">Fallo Crítico de Conexión</h3>
                <p className="text-red-300 mb-8">{error}</p>
                <button onClick={() => cargarPersonajes()} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 px-6 py-3 rounded-xl font-bold uppercase tracking-wider transition-all">
                  Re-establecer enlace
                </button>
              </div>
            ) : (
              <>
                {datosFiltrados.length === 0 ? (
                  <div className="text-center py-24 bg-slate-800/30 rounded-3xl border border-slate-700/50 border-dashed backdrop-blur-sm">
                    <div className="text-7xl mb-6 opacity-80">🪐</div>
                    <h3 className="text-2xl font-bold text-slate-300 mb-3">Sujeto no localizado</h3>
                    <p className="text-slate-500">Ningún registro coincide con los parámetros de búsqueda.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {datosFiltrados.map((personaje) => (
                      <ElementoCard 
                        key={personaje.id} personaje={personaje}
                        alAgregarFavorito={agregarAFavoritos} esFavorito={favoritos.some(fav => fav.id === personaje.id)}
                        alInspeccionar={setPersonajeSeleccionado}
                      />
                    ))}
                  </div>
                )}

                {/* BOTÓN CARGAR MÁS (PAGINACIÓN) */}
                {siguienteUrl && datosFiltrados.length > 0 && (
                  <div className="mt-12 flex justify-center">
                    <button
                      onClick={() => cargarPersonajes(siguienteUrl, true)}
                      disabled={cargandoMas}
                      className="group relative px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold text-white border border-slate-600 hover:border-green-500/50 shadow-lg transition-all duration-300 flex items-center gap-3 overflow-hidden"
                    >
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-green-500/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                      {cargandoMas ? (
                        <><Loader2 className="w-5 h-5 animate-spin text-green-400" /> Descargando datos...</>
                      ) : (
                        <>Ampliar rango de búsqueda <ChevronDown className="w-5 h-5 text-green-400 group-hover:translate-y-1 transition-transform" /></>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* VISTA 2: COLECCIÓN */}
        {vistaActiva === 'coleccion' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
            {favoritos.length === 0 ? (
              <div className="text-center py-24 bg-indigo-950/20 rounded-3xl border border-indigo-500/20 border-dashed backdrop-blur-sm">
                <Database className="w-20 h-20 text-indigo-500/50 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-indigo-300 mb-3">Base de datos local vacía</h3>
                <p className="text-indigo-400/60 mb-8">Debes capturar sujetos desde el directorio para registrarlos aquí.</p>
                <button 
                  onClick={() => setVistaActiva('explorar')}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all"
                >
                  Volver al Directorio
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {favoritos.map((fav) => (
                  <FavoritoCard key={fav.id} favorito={fav} alEliminar={eliminarFavorito} alActualizar={actualizarFavorito} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODAL DE DETALLES */}
        {personajeSeleccionado && (
          <ModalDetalle 
            personaje={personajeSeleccionado} 
            alCerrar={() => setPersonajeSeleccionado(null)} 
          />
        )}
      </main>
    </div>
  );
}