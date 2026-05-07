# MAPSSchool - Conectando Donadores y Receptores de Útiles Escolares 📚🗺️

**MAPSSchool** es una plataforma web solidaria desarrollada como Proyecto de Grado. Su objetivo principal es facilitar la donación de útiles escolares en la ciudad de Sogamoso mediante un sistema geolocalizado en tiempo real. 

La aplicación permite a los **Donadores** registrar útiles y ubicarlos en un mapa, y a los **Receptores** encontrar las donaciones cercanas y trazar una ruta paso a paso para ir a recogerlas.

---

## 🛠️ Tecnologías Utilizadas
- **Frontend:** React + Vite (JavaScript)
- **Estilos:** CSS puro (Variables CSS, Modo Claro/Oscuro)
- **Base de Datos:** PostgreSQL en la nube (Supabase)
- **Mapas y Rutas:** Leaflet y Leaflet Routing Machine

---

## ⚙️ Requisitos Previos para el Tutor
Para poder ejecutar este proyecto en su máquina local, asegúrese de tener instalado:
- [Node.js](https://nodejs.org/es/) (Versión 18 o superior).
- Git (Opcional, para clonar el repositorio).

---

## 🚀 Guía de Instalación Paso a Paso

1. **Descargar el proyecto:**
   Descargue este repositorio como un archivo ZIP y extráigalo, o clónelo usando Git:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   ```

2. **Abrir la terminal:**
   Navegue hasta la carpeta raíz del proyecto (`Proyecto`) usando su terminal o consola de comandos.

3. **Instalar dependencias:**
   Ejecute el siguiente comando para descargar todas las librerías necesarias (React, Leaflet, Supabase, etc.):
   ```bash
   npm install
   ```

4. **Configurar las Variables de Entorno (IMPORTANTE):**
   Para que la aplicación pueda conectarse a la base de datos de PostgreSQL, necesita las credenciales de Supabase. 
   Cree un archivo llamado **exactamente** `.env.local` en la raíz del proyecto (al mismo nivel que el `package.json`) y pegue las siguientes dos líneas dentro:
   ```env
   VITE_SUPABASE_URL=https://sebcfrktrvesdkzbnjnb.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_87yN-bwDBAVNnCPunldeZQ_51P-Ae1M
   ```
   *(Nota: Se proveen las credenciales reales de prueba exclusivamente para propósitos de evaluación académica).*

5. **Iniciar el servidor local:**
   Una vez configurado, levante el servidor de desarrollo ejecutando:
   ```bash
   npm run dev
   ```

6. **Probar la aplicación:**
   Abra su navegador web y diríjase a la URL que le arroje la terminal, por lo general: **http://localhost:5173/**

---

## ⚠️ AVISO IMPORTANTE SOBRE SUPABASE (Para el Evaluador)
Este proyecto utiliza la capa gratuita de **Supabase** para alojar la base de datos PostgreSQL y el almacenamiento de imágenes. 

> **Las políticas de Supabase dictan que, si una base de datos en su plan gratuito no recibe consultas o inicios de sesión durante 7 días consecutivos, el servidor entra en estado de suspensión (Pausado) automáticamente.**

Si al abrir la aplicación nota que las donaciones no cargan o arroja un error de base de datos, es muy probable que el proyecto en la nube haya sido pausado por inactividad. En caso de presentarse esta situación durante la calificación, por favor **comuníquese con el estudiante (Camilo/Equipo)** para que ingresemos al panel de control de Supabase y presionemos el botón *"Restore project"*, lo cual reactiva la base de datos en 2 minutos.
