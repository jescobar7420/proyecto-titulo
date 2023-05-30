import { Marca } from "./marca";
import { TipoProducto } from "./tipo-producto";

export interface CategoriaMarcaTipo {
    id_categoria: number;
    marcas: Marca[];
    tipos: TipoProducto[];
}