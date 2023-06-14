export interface CartProduct {
    id_producto: number;
    nombre: string;
    marca: string;
    imagen: string;
    precio: string;
    cantidad: number;
    precio_total?: number;
}