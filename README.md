# gqg_system
Desarrollo de una funcionalidad adicional para un sistema de un cliente ficticio, en el marco del primer examen final de la materia Ingeniería de Software III - FPUNA.

Este sistema permite registrar ventas, consultar entidades maestras (clientes, monedas, documentos, plazos, etc.) y visualizar las cuentas por cobrar pendientes.

## 🚀 Tecnologías utilizadas

- **Frontend**: Next.js (App Router)
- **Backend API**: Next.js API Routes
- **Base de datos**: POSGRESQL
- **Estilos**: Tailwind CSS
- **Librerías adicionales**: `date-fns` para manejo de fechas

## Configuración del entorno

1. **Clona el repositorio**:

```bash
git clone https://github.com/estigar95/gqg_system.git
npm install
cd ventas-app

2. **Agregar .env
# Configuración de PostgreSQL (Clever Cloud)
POSTGRES_HOST=***
POSTGRES_DATABASE=***
POSTGRES_USER=***
POSTGRES_PASSWORD=***
POSTGRES_PORT=***
POSTGRES_URI=***

3. Ejecutar el servidor 
npm run dev