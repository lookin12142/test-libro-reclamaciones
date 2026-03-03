# 📝 Libro de Reclamaciones Digital

Sistema completo de Libro de Reclamaciones conforme a la Ley N° 29571 (Código de Protección y Defensa del Consumidor) con integración a Supabase y AWS S3.

## ✨ Características

- ✅ Formulario completo de reclamaciones y quejas
- ✅ Generación automática de número de expediente (LR-YYYY-NNNN)
- ✅ Almacenamiento en base de datos Supabase
- ✅ Carga de archivos adjuntos a AWS S3
- ✅ API REST para gestión de reclamaciones
- ✅ Validaciones completas de formulario
- ✅ Diseño responsive con Tailwind CSS
- ✅ Componentes UI con Radix UI
- ✅ Tipos TypeScript completos

## 📋 Requisitos

- Node.js 18+ 
- Cuenta en [Supabase](https://supabase.com) (gratuita)
- Cuenta en [AWS](https://aws.amazon.com) con acceso a S3

## 🚀 Inicio Rápido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Supabase

1. Crea un proyecto en [Supabase](https://app.supabase.com)
2. Ejecuta el script `supabase-schema.sql` en el SQL Editor
3. Copia tus credenciales de Settings → API

### 3. Configurar AWS S3

1. Crea un bucket en [AWS S3](https://s3.console.aws.amazon.com)
2. Crea un usuario IAM con acceso a S3
3. Guarda las credenciales (Access Key ID y Secret Access Key)

### 4. Configurar Variables de Entorno

Completa el archivo `.env` con tus credenciales:

```env
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
AWS_S3_BUCKET_NAME=libro-reclamaciones-archivos

# Public
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

### 5. Iniciar el servidor

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📚 Documentación

- **[SETUP-GUIDE.md](./SETUP-GUIDE.md)** - Guía completa de configuración paso a paso
- **[COMO-OBTENER-CREDENCIALES.md](./COMO-OBTENER-CREDENCIALES.md)** - Cómo obtener tus credenciales de Supabase y AWS
- **[RESUMEN.md](./RESUMEN.md)** - Resumen completo del proyecto y arquitectura
- **[queries-utiles.sql](./queries-utiles.sql)** - Consultas SQL útiles para Supabase
- **[supabase-schema.sql](./supabase-schema.sql)** - Script SQL para crear las tablas

## 🗂️ Estructura del Proyecto

```text
/
├── public/
│   └── images/           # Imágenes estáticas
├── src/
│   ├── components/       # Componentes React
│   │   ├── complaint-form.tsx
│   │   ├── complaint-header.tsx
│   │   ├── success-message.tsx
│   │   └── ui/          # Componentes UI (Radix)
│   ├── lib/
│   │   ├── supabase.ts  # Cliente de Supabase
│   │   ├── s3.ts        # Utilidades de AWS S3
│   │   └── utils.ts     # Utilidades generales
│   ├── pages/
│   │   ├── index.astro  # Página principal
│   │   └── api/
│   │       └── complaints.ts  # API de reclamaciones
│   └── styles/
│       └── globals.css  # Estilos globales
├── .env                 # Variables de entorno
├── supabase-schema.sql  # Script SQL
└── package.json
```

## 🔌 API Endpoints

### POST `/api/complaints`
Crea una nueva reclamación

**Body**: `FormData` con los datos del formulario y archivos

**Response**:
```json
{
  "success": true,
  "data": {
    "complaint": { ...datos... },
    "attachments": [ ...archivos... ],
    "message": "Reclamación registrada. Nº expediente: LR-2026-0001"
  }
}
```

### GET `/api/complaints`
Consulta reclamaciones

**Query Parameters**:
- `email`: Email del consumidor
- `expediente`: Número de expediente

## 🗄️ Base de Datos

### Tabla `complaints`
- Información del consumidor
- Detalles de la reclamación
- Estado (pendiente, en_proceso, resuelto, cerrado)
- Número de expediente auto-generado

### Tabla `complaint_attachments`
- Referencias a archivos en S3
- Metadatos de archivos (nombre, tipo, tamaño)

## 🧞 Comandos

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
