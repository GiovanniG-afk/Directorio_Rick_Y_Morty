# Portal Dex: Directorio Multiversal

Una aplicación web de página única (SPA) desarrollada con React y TypeScript que permite explorar, buscar y gestionar personajes del universo de Rick y Morty. 

## API Utilizada
El proyecto consume la **Rick and Morty API** pública (`https://rickandmortyapi.com/api/character`), extrayendo datos como nombre, estado, especie, género, ubicación y cantidad de episodios.

## Instrucciones de Instalación y Ejecución
Para correr este proyecto en tu entorno local, sigue estos pasos:

1. Clona este repositorio:
   ```bash
   git clone [https://github.com/GiovanniG-afk/Directorio_Rick_Y_Morty.git](https://github.com/GiovanniG-afk/Directorio_Rick_Y_Morty.git)

¡Claro que sí! Con esto cerramos tu proyecto con broche de oro.

He preparado dos secciones. La primera es el código exacto que debes copiar y pegar en tu archivo **`README.md`** en VS Code. La segunda sección es el texto estructurado que debes copiar y pegar en tu **documento de Word** para cumplir con la Defensa Breve y el Anexo de IA.

---

### Parte 1: Archivo `README.md`

Abre el archivo `README.md` que está en tu VS Code (borra lo que tenga adentro) y pega lo siguiente. *(Nota: Recuerda tomar un par de capturas de pantalla de tu app, guardarlas en una carpeta llamada `capturas` dentro de tu proyecto y cambiar el nombre de los archivos en la sección de capturas)*.

```markdown
# Portal Dex: Directorio Multiversal

Una aplicación web de página única (SPA) desarrollada con React y TypeScript que permite explorar, buscar y gestionar personajes del universo de Rick y Morty. 

## API Utilizada
El proyecto consume la **Rick and Morty API** pública (`https://rickandmortyapi.com/api/character`), extrayendo datos como nombre, estado, especie, género, ubicación y cantidad de episodios.

## Instrucciones de Instalación y Ejecución
Para correr este proyecto en tu entorno local, sigue estos pasos:

1. Clona este repositorio:
   ```bash
   git clone [https://github.com/GiovanniG-afk/Directorio_Rick_Y_Morty.git](https://github.com/GiovanniG-afk/Directorio_Rick_Y_Morty.git)

```

2. Navega a la carpeta del proyecto:
```bash
cd Directorio_Rick_Y_Morty

```


3. Instala las dependencias necesarias:
```bash
npm install

```


4. Ejecuta el servidor de desarrollo:
```bash
npm run dev

```


5. Abre el navegador en la dirección indicada en la terminal (usualmente `http://localhost:5173`).

## Funcionalidades Principales

* **Exploración Dinámica:** Consumo asíncrono de la API con manejo de estados de carga y error.
* **Paginación Integrada:** Opción para cargar y concatenar múltiples páginas de resultados de la API.
* **Búsqueda en Tiempo Real:** Filtrado instantáneo de personajes en pantalla sin recargar la página utilizando `useMemo`.
* **Expedientes Clasificados:** Vista de detalle mediante un componente Modal interactivo que revela datos biológicos y un estado clasificado generado dinámicamente.
* **Base de Datos Local (CRUD):**
* **Crear/Leer:** Guardar personajes favoritos en "Sujetos Capturados" con persistencia en Local Storage.
* **Actualizar:** Agregar y editar notas personales en los registros guardados.
* **Eliminar:** Remover sujetos de la colección local.


* **Diseño UI/UX:** Interfaz temática ciber-espacial (Dark Mode) construida íntegramente con Tailwind CSS v4 y Lucide React.





---

**Desarrollado por:** Giovanni Garrido
**Asignatura:** Programación Front End

```

---

### Parte 2: Documento Word (Defensa y Anexo)
Copia este contenido en un documento de Word (puedes darle formato con negritas y títulos para que se vea presentable).

**ANEXO DE INTELIGENCIA ARTIFICIAL**

*   **Herramienta utilizada:** Gemini (Google).
*   **Prompts principales empleados:**
    *   *"puedes desarrollar la app porfavor basada en la rúbrica?"* (Para la generación de la estructura inicial).
    *   *"puedes mejorar el diseño mas porfis asi como la poket-dex que hicimos antes y logra que se vean todos los personajes"* (Para refactorizar UI y lógica de paginación).
    *   *"a lo que me referia era que me dejara presionar al personaje tambien y me mostrara tanto informacion como algun dato"* (Para la creación del Modal y paso de props).
    *   *"me das el paso a paso para subir a github y vercel?"* (Para resolución de errores de despliegue TS y configuración de Tailwind v4).
*   **Fragmentos apoyados:** Se utilizó la IA como tutor para estructurar el modelo de interfaces de TypeScript (`interface Character`), la lógica del `useMemo` para el buscador en tiempo real, la inyección del CRUD en Local Storage y la migración de dependencias a Tailwind v4 y Lucide React.
*   **Validaciones realizadas:** Pruebas de renderizado y diseño responsivo ejecutadas de forma nativa en el navegador Opera. Resolución exhaustiva de advertencias de ESLint y tipado estricto de TypeScript (`error TS6133`, `TS2307`) para lograr un entorno de compilación exitoso en la nube (Vercel).
*   **Fuentes consultadas:** Documentación oficial de la API de Rick and Morty.

---

**DEFENSA BREVE DEL PROYECTO**

**1. Flujo de datos y Arquitectura:**
El flujo de datos sigue un modelo unidireccional (Top-Down). El componente principal (`App.tsx`) actúa como el controlador central. Desde allí, los datos obtenidos de la API y del Local Storage se distribuyen hacia componentes hijos (como `ElementoCard`, `ModalDetalle` o la pestaña de Favoritos) a través de *props*. Cuando un componente hijo necesita modificar un dato (ej. guardar un favorito), ejecuta una función enviada desde el padre, manteniendo sincronizada la interfaz.

**2. Estados de React (useState):**
Se implementaron múltiples estados para controlar la aplicación:
*   `datos`: Almacena el arreglo de objetos (personajes) descargados de la API.
*   `cargando` y `error`: Manejan la experiencia de usuario (UX) mostrando un "Loader" o un mensaje informativo mientras la petición asíncrona se resuelve.
*   `busqueda`: Captura el texto del input controlado para filtrar datos.
*   `favoritos`: Mantiene el arreglo de la colección local sincronizado con el renderizado.
*   `personajeSeleccionado`: Controla la apertura, cierre y contenido dinámico del Modal.

**3. Comunicación con Props:**
Se utilizan *props* para modularizar la aplicación. Por ejemplo, al componente de la tarjeta del personaje se le envía el objeto de datos (`personaje={char}`) y funciones de callback como `alGuardar={() => guardarFavorito(char)}` y `alInspeccionar={() => setPersonajeSeleccionado(char)}`. Esto evita concentrar el diseño directamente en el componente principal y permite reutilizar las tarjetas.

**4. Consumo de API:**
Se implementó la función asíncrona mediante `fetch` combinada con `async/await`. La petición principal se gatilla una única vez al montar la aplicación mediante un `useEffect` sin dependencias `[]`. Para resolver la limitación de 20 resultados por página de la API, se capturó la propiedad `info.next` de la respuesta, creando un botón que ejecuta un nuevo `fetch` hacia esa URL y concatena (usando *spread operator*) los nuevos resultados al estado existente. Se incluyó un bloque `try/catch` para manejar caídas del servidor.

**5. Persistencia y CRUD (Local Storage):**
La gestión de la colección personal se realiza manteniendo el estado de React (`favoritos`) en sincronía con el almacenamiento del navegador mediante `useEffect`:
*   **Create:** Al añadir un personaje, se valida que no exista previamente usando `some()`. Si es nuevo, se inserta en el arreglo inicializando el campo de nota en blanco.
*   **Read:** Un efecto de montaje lee `localStorage.getItem("coleccion-rickmorty")` y lo parsea con `JSON.parse` para iniciar la aplicación con los datos guardados en visitas anteriores.
*   **Update:** En la vista de capturados, se habilita un modo de edición que utiliza el método `map()` para localizar el ID específico y sobrescribir la propiedad de notas personales, lo que dispara automáticamente el `useEffect` de guardado.
*   **Delete:** Se utiliza el método `filter()` para generar un nuevo arreglo excluyendo el ID del personaje seleccionado, eliminándolo visualmente y del disco duro del navegador.
