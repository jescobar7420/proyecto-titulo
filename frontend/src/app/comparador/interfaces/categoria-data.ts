import { Marca } from "./marca";
import { TipoProducto } from "./tipo-producto";

export interface CategoriaData {
    marcas: Marca[],
    tipos: TipoProducto[]
}