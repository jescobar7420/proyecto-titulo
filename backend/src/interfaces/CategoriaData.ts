import { Marca } from "./Marca";
import { Tipo } from "./Tipo";

export interface CategoriaData {
    marcas: Marca[],
    tipos: Tipo[]
}