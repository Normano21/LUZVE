# LUZVE — Especificación del MVP

## 1. Descripción

LUZVE es una plataforma web comunitaria diseñada para ayudar a las personas en Venezuela a conocer el estado de la electricidad en su zona.

El objetivo inicial es reducir la incertidumbre causada por los apagones mediante información basada en reportes de usuarios.

La aplicación debe ser extremadamente sencilla de utilizar:

> Abrir → saber qué ocurre → reportar → salir.

---

## 2. Problema que resolvemos

El problema principal no es solamente la falta de electricidad.

Es la incertidumbre que existe durante los apagones debido a la falta de información confiable.

Actualmente una persona puede tener que:

- preguntar por WhatsApp;
- consultar grupos;
- preguntar a familiares o vecinos;
- revisar redes sociales;
- esperar sin información.

LUZVE busca responder rápidamente:

- ¿Hay electricidad en mi zona?
- ¿Se fue la electricidad?
- ¿Cuánto tiempo lleva el apagón?
- ¿Ya volvió?
- ¿Qué están reportando otras personas de mi zona?

---

## 3. Usuario objetivo

El usuario principal es cualquier persona afectada por los apagones eléctricos en Venezuela.

Inicialmente el MVP se enfocará en Valencia, Carabobo.

Usuarios especialmente relevantes:

- Personas que viven en zonas con racionamiento frecuente.
- Personas que trabajan o estudian en zonas diferentes a su vivienda.
- Comerciantes y trabajadores independientes.
- Personas que necesitan saber si deben esperar o cambiar sus planes debido a un apagón.

---

## 4. Principio de simplicidad

LUZVE debe seguir una filosofía similar a las aplicaciones que resuelven una necesidad cotidiana de forma inmediata.

El usuario debe poder abrir la aplicación y obtener información útil sin necesidad de aprender a utilizarla.

La aplicación no debe exigir registro para utilizar las funciones principales.

---

## 5. Registro de usuarios

El MVP NO requerirá:

- correo electrónico;
- contraseña;
- número telefónico;
- nombre;
- cuenta de Google;
- cuenta de Facebook.

La aplicación podrá utilizar un identificador anónimo del dispositivo para evitar depender de una cuenta de usuario.

Este identificador no debe mostrar información personal al usuario.

---

## 6. Ubicación

El usuario podrá establecer su zona mediante:

### Opción A — Ubicación automática

Permitir que el navegador determine la ubicación del usuario.

### Opción B — Selección manual

Permitir seleccionar la ubicación manualmente.

Inicialmente se priorizará:

- Estado
- Municipio
- Parroquia
- Zona

La zona seleccionada podrá almacenarse localmente en el dispositivo para evitar solicitarla nuevamente en cada visita.

---

## 7. Funciones principales del MVP

### 7.1 Estado actual

La aplicación debe mostrar uno de tres estados:

🟢 CON ELECTRICIDAD

🔴 SIN ELECTRICIDAD

⚪ INFORMACIÓN INSUFICIENTE

---

### 7.2 Reportar apagón

El usuario debe poder reportar que la electricidad se fue con la menor cantidad de acciones posible.

Idealmente:

> Un toque.

El sistema debe registrar automáticamente:

- zona;
- fecha;
- hora;
- identificador anónimo del dispositivo.

No se deben solicitar formularios adicionales para realizar un reporte básico.

---

### 7.3 Reportar regreso de electricidad

Cuando la electricidad vuelva, el usuario podrá seleccionar:

> VOLVIÓ LA LUZ

El sistema registrará automáticamente:

- zona;
- fecha;
- hora;
- identificador anónimo del dispositivo.

La aplicación podrá calcular posteriormente la duración del apagón.

---

### 7.4 Confirmación comunitaria

Los reportes de múltiples dispositivos deben utilizarse para determinar la confiabilidad del estado de una zona.

Ejemplo:

1 reporte:
> Información insuficiente.

Varios reportes independientes:
> Apagón confirmado.

La cantidad y diversidad de reportes deberá utilizarse posteriormente para construir un sistema de confianza.

---

### 7.5 Historial

El usuario podrá consultar inicialmente los últimos 7 días.

El historial deberá mostrar:

- fecha;
- hora de inicio;
- hora de regreso;
- duración;
- estado.

Posteriormente podrá mostrar estadísticas como:

- cantidad de apagones;
- duración promedio;
- tiempo total sin electricidad;
- horarios habituales de los apagones.

---

## 8. Pantalla principal

La pantalla principal debe priorizar el estado actual.

Ejemplo:

### Con electricidad

⚡ LUZVE

📍 Mi zona

🟢 CON ELECTRICIDAD

Último reporte: hace 4 minutos

23 personas reportan electricidad.

---

### Sin electricidad

⚡ LUZVE

📍 Mi zona

🔴 SIN ELECTRICIDAD

El apagón comenzó aproximadamente a las 5:42 PM.

Duración:

3h 18min

47 personas reportan el apagón.

---

## 9. Acciones principales

Las acciones deben adaptarse al estado actual.

Si hay electricidad:

> 🔴 SE FUE LA LUZ

Si no hay electricidad:

> 🟢 VOLVIÓ LA LUZ

No se deben mostrar acciones contradictorias como acción principal.

---

## 10. Fuera del alcance del MVP

No se desarrollarán inicialmente:

- predicción de apagones;
- inteligencia artificial;
- mapa nacional;
- integración con WhatsApp;
- red social;
- sistema de comentarios;
- perfiles de usuario;
- monetización;
- publicidad invasiva;
- información sobre otros servicios públicos;
- horarios oficiales de racionamiento;
- funcionalidades complejas de administración.

Estas funciones podrán evaluarse posteriormente.

---

## 11. Primera zona de lanzamiento

El MVP se enfocará inicialmente en:

> Valencia, Carabobo, Venezuela.

El objetivo inicial será validar el comportamiento del sistema con usuarios reales antes de expandirlo a otras ciudades.

---

## 12. Métrica principal del MVP

La métrica inicial más importante no será la cantidad de descargas.

Será:

> Cantidad de reportes eléctricos útiles generados por día.

También serán importantes posteriormente:

- usuarios activos;
- reportes por usuario;
- zonas con suficiente información;
- precisión del estado reportado;
- tiempo entre un apagón y su confirmación;
- retención de usuarios.

---

## 13. Visión futura

Una vez que LUZVE tenga suficientes datos históricos, podrá analizar patrones eléctricos por zona.

Esto podría permitir desarrollar:

- estadísticas avanzadas;
- patrones horarios;
- estimaciones de duración;
- predicciones;
- alertas;
- comparación entre zonas;
- análisis de comportamiento eléctrico.

Estas funciones NO forman parte del MVP inicial.

---

## 14. Principio fundamental

LUZVE debe resolver una necesidad real de forma rápida.

La experiencia ideal es:

> Abrir → ver estado → reportar si cambió → continuar con la vida.