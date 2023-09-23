import fs from "fs";


class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    #newID; 

    
    fileExist() {
        return fs.existsSync(this.filePath)
    }

    
    async getProducts() {
        try {
            if (this.fileExist) {
                const products = await fs.promises.readFile(this.filePath, "utf-8");
                return JSON.parse(products);
            } else {
                throw new Error("Producto no encontrado");
            }
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }

    
    async addProduct(product) {
        try { 
            if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
                throw new Error("Todos los campos son obligatorios");

            }
            const fileProducts = await this.getProducts(); 
            const codeExist = fileProducts.find((elem) => elem.code === product.code); 

            if (codeExist) {
                throw new Error("El codigo de producto ya existe. No se agrega el producto");
            };

            
            if (fileProducts.length == 0) {
                this.#newID = 1;
            } else {
                this.#newID = fileProducts[fileProducts.length - 1].id + 1;
            }

            
            const newProduct = {
                id: this.#newID,
                ...product,
                status: true
            }

            
            fileProducts.push(newProduct);
            await fs.promises.writeFile(this.filePath, JSON.stringify(fileProducts, null, "\t"));
            console.log("Producto agregado");
            return(newProduct);


        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }

    
    async getPtoductById(productId) {
        try {
            const fileProducts = await this.getProducts(); 
            const productFind = fileProducts.find((elem) => elem.id === productId); 

            if (! productFind) {
                console.log("No se encontró producto con el id indicado");
            }

            return productFind; 

        } catch (error) {
            console.log(error.message);
            throw error;
        }

    }

    
    async updateProduct(productId, update) {
        try { 
            
            if (!('title' in update || 'description' in update || 'price' in update || 'thumbnail' in update || 'code' in update || 'stock' in update)) {
                return console.log("Error al intentar modificar el producto. Debe proporcionar al menos una de las propiedades: title, description, price, thumbnail, code, stock.");
            }

             
            for (const key in update) {
                if (!['title', 'description', 'price', 'thumbnail', 'code', 'stock'].includes(key)) {
                    return console.log(`Error al intentar modificar el producto. Propiedad no permitida: ${key}`);
                }
            }

            const fileProducts = await this.getProducts(); 
            const productFind = fileProducts.find((elem) => elem.id === productId); 

            
            if (! productFind) {
                return console.log("No se encontró producto para modificar con el id indicado");

            }

            const productIndx = fileProducts.findIndex((elem) => elem.id === productId); 
            fileProducts[productIndx] = {
                ... fileProducts[productIndx],
                ...update
            } 
            
            
            await fs.promises.writeFile(this.filePath, JSON.stringify(fileProducts, null, "\t")); 
            console.log("Producto modificado:", fileProducts[productIndx])

        } catch (error) {
            console.log(error.message);
            throw error;
        }

    }

    
    async deleteProduct(productId) {
        try {
            const fileProducts = await this.getProducts();
            const deletedProduct = fileProducts.find((elem) => elem.id === productId);

            if (! deletedProduct) { 
                return console.log("No se encuentra producto para borrar con el ID indicado");
            }

            const products = fileProducts.filter((elem) => elem.id !== productId); 
            await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, "\t")); 
            console.log("Producto eliminado: ", deletedProduct);
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }
}

export { ProductManager };