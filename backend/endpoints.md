# Endpoints

- [Auth](#auth)
- [Productos](#productos)
- [Carrito](#carrito)
- [Pedidos](#pedidos)
- [Pagos](#pagos)
- [Envios](#envios)
- [Reviews](#reviews)
- [Comentarios](#comentarios)
 

---

## Auth

### POST /api/auth/register
```json
{
    "nombre": "string",
    "apellido": "string",
    "email": "string",
    "contrasena": "string"
}
```

### POST /api/auth/login
```json
{
    "email": "string",
    "contrasena": "string"
}
```

---

## Productos

### GET /api/productos
Sin body.

### GET /api/productos/:id
Sin body.

### PATCH /api/productos/admin/:id -> (TOKEN) & (ADMIN)
```json
{
    "nombre": "string",
    "precio": "number",
    "estado": "string"
}
```

---

## Carrito

### GET /api/carrito -> (TOKEN)
Sin body.

### GET /api/carrito/admin -> (TOKEN) & (ADMIN)
Sin body.

### POST /api/carrito -> (TOKEN)
```json
{
    "productoId": "string",
    "cantidad": "number"
}
```

### DELETE /api/carrito/:productoId -> (TOKEN)
Sin body.

---

## Pedidos

### GET /api/pedidos/mis-pedidos -> (TOKEN)
Sin body.

### GET /api/pedidos/admin -> (TOKEN) & (ADMIN)
Sin body.

### POST /api/pedidos -> (TOKEN)
Sin body.

### PATCH /api/pedidos/:id -> (TOKEN) & (ADMIN)
```json
{
    "estado": "string"
}
```

---

## Pagos

### GET /api/pagos/mis-pagos -> (TOKEN)
Sin body.

### GET /api/pagos/admin -> (TOKEN) & (ADMIN)
Sin body.

### POST /api/pagos/:pedidoId -> (TOKEN)
```json
{
    "metodoPago": "string"
}
```

---

## Envios

### GET /api/envios/:pedidoId -> (TOKEN)
Sin body.

### GET /api/envios/admin -> (TOKEN) & (ADMIN)
Sin body.

### POST /api/envios/:pedidoId -> (TOKEN)
```json
{
    "direccion": "string"
}
```

### PATCH /api/envios/:pedidoId -> (TOKEN) & (ADMIN)
```json
{
    "estado": "string"
}
```

---

## Reviews

### GET /api/reviews
Sin body.

### GET /api/reviews/producto/:id
Sin body.

### POST /api/reviews -> (TOKEN)
```json
{
    "productoId": "string",
    "rating": "number"
}
```

### DELETE /api/reviews/:id -> (TOKEN) 

---

## Comentarios

### GET /api/comentarios


### POST /api/comentarios -> (TOKEN)
```json
{
    "contenido": "string"
}
```

### DELETE /api/comentarios/:id -> (TOKEN) 
