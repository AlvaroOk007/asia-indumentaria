#--------------------------------------------------------------------
# Instalar con pip install Flask
from flask import Flask, request, jsonify, render_template
#from flask import request

# Instalar con pip install flask-cors
from flask_cors import CORS

# Instalar con pip install mysql-connector-python
import mysql.connector

# Si es necesario, pip install Werkzeug
from werkzeug.utils import secure_filename

from flask import Flask, send_from_directory

# No es necesario instalar, es parte del sistema standard de Python
import os
import time
#--------------------------------------------------------------------



app = Flask(__name__, static_url_path='/src', static_folder='src')
CORS(app, resources={r"/*": {"origins": "*"}})  # Esto habilitará CORS para todas las rutas

class Catalogo:
    #----------------------------------------------------------------
    # Constructor de la clase
    def __init__(self, host, user, password, database, port=3307):
        # Primero, establecemos una conexión sin especificar la base de datos
        self.conn = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            port=port
        )
        self.cursor = self.conn.cursor()

        # Intentamos seleccionar la base de datos
        try:
            self.cursor.execute(f"USE {database}")
        except mysql.connector.Error as err:
            # Si la base de datos no existe, la creamos
            if err.errno == mysql.connector.errorcode.ER_BAD_DB_ERROR:
                self.cursor.execute(f"CREATE DATABASE {database}")
                self.conn.database = database
            else:
                raise err

        # Una vez que la base de datos está establecida, creamos la tabla si no existe
        self.cursor.execute('''CREATE TABLE IF NOT EXISTS productos (
            codigo INT AUTO_INCREMENT PRIMARY KEY,
            titulo VARCHAR(40) NOT NULL,
            descripcion VARCHAR(255) NOT NULL,
            cantidad INT NOT NULL,
            precio DECIMAL(10, 2) NOT NULL,
            imagen_url VARCHAR(255))''')
        self.conn.commit()

        # Cerrar el cursor inicial y abrir uno nuevo con el parámetro dictionary=True
        self.cursor.close()
        self.cursor = self.conn.cursor(dictionary=True)

    def agregar_producto(self, titulo, descripcion, cantidad, precio, imagen):
               
        sql = "INSERT INTO productos (titulo, descripcion, cantidad, precio, imagen_url) VALUES (%s, %s, %s, %s, %s)"
        valores = (titulo, descripcion, cantidad, precio, imagen)

        self.cursor.execute(sql, valores)        
        self.conn.commit()
        return self.cursor.lastrowid

    #----------------------------------------------------------------
    def consultar_producto(self, codigo):
        # Consultamos un producto a partir de su código
        self.cursor.execute(f"SELECT * FROM productos WHERE codigo = {codigo}")
        return self.cursor.fetchone()

    #----------------------------------------------------------------
    def modificar_producto(self, codigo, nuevo_titulo, nueva_descripcion, nueva_cantidad, nuevo_precio, nueva_imagen):
        sql = "UPDATE productos SET titulo = %s, descripcion = %s, cantidad = %s, precio = %s, imagen_url = %s WHERE codigo = %s"
        valores = (nuevo_titulo, nueva_descripcion, nueva_cantidad, nuevo_precio, nueva_imagen, codigo)
        try:
            self.cursor.execute(sql, valores)
            self.conn.commit()
            return self.cursor.rowcount > 0
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            print(f"SQL: {sql}")
            print(f"Valores: {valores}")
            return False

    #----------------------------------------------------------------
    def listar_productos(self):
        self.cursor.execute("SELECT * FROM productos")
        productos = self.cursor.fetchall()
        return productos

    #----------------------------------------------------------------
    def eliminar_producto(self, codigo):
        # Eliminamos un producto de la tabla a partir de su código
        self.cursor.execute(f"DELETE FROM productos WHERE codigo = {codigo}")
        self.conn.commit()
        return self.cursor.rowcount > 0

    #----------------------------------------------------------------
    def mostrar_producto(self, codigo):
        # Mostramos los datos de un producto a partir de su código
        producto = self.consultar_producto(codigo)
        if producto:
            print("-" * 40)
            print(f"Código.....: {producto['codigo']}")
            print(f"titulo.....: {producto['titulo']}")
            print(f"Descripción: {producto['descripcion']}")
            print(f"Cantidad...: {producto['cantidad']}")
            print(f"Precio.....: {producto['precio']}")
            print(f"Imagen.....: {producto['imagen_url']}")
            print("-" * 40)
        else:
            print("Producto no encontrado.")

catalogo = Catalogo(host='localhost', user='root', password='1234', database='AsiaIndumentaria', port=3307)

RUTA_DESTINO = './src/imgs/'

#Al subir al servidor, deberá utilizarse la siguiente ruta. USUARIO debe ser reemplazado por el nombre de usuario de Pythonanywhere
#RUTA_DESTINO = '/home/USUARIO/mysite/static/imagenes'

@app.route('/src/imgs/<path:filename>')
def send_image(filename):
    return send_from_directory('src/imgs', filename)
#--------------------------------------------------------------------
# Listar todos los productos
#--------------------------------------------------------------------
#La ruta Flask /productos con el método HTTP GET está diseñada para proporcionar los detalles de todos los productos almacenados en la base de datos.
#El método devuelve una lista con todos los productos en formato JSON.
@app.route("/productos", methods=["GET"])
def listar_productos():
    productos = catalogo.listar_productos()
    return jsonify(productos)


#--------------------------------------------------------------------
# Mostrar un sólo producto según su código
#--------------------------------------------------------------------
#La ruta Flask /productos/<int:codigo> con el método HTTP GET está diseñada para proporcionar los detalles de un producto específico basado en su código.
#El método busca en la base de datos el producto con el código especificado y devuelve un JSON con los detalles del producto si lo encuentra, o None si no lo encuentra.
@app.route("/productos/<int:codigo>", methods=["GET"])
def mostrar_producto(codigo):
    producto = catalogo.consultar_producto(codigo)
    if producto:
        return jsonify(producto), 201
    else:
        return "Producto no encontrado", 404
    

@app.route("/")
def index():
    return render_template("index.html")


#--------------------------------------------------------------------
# Agregar un producto
#--------------------------------------------------------------------
@app.route("/productos", methods=["POST"])
#La ruta Flask `/productos` con el método HTTP POST está diseñada para permitir la adición de un nuevo producto a la base de datos.
#La función agregar_producto se asocia con esta URL y es llamada cuando se hace una solicitud POST a /productos.
def agregar_producto():
    #Recojo los datos del form
    titulo = request.form['titulo']
    descripcion = request.form['descripcion']
    cantidad = request.form['cantidad']
    precio = request.form['precio']
    imagen = request.files['imagen'] 
    nombre_imagen=""

    
    # Genero el nombre de la imagen
    nombre_imagen = secure_filename(imagen.filename) #Chequea el nombre del archivo de la imagen, asegurándose de que sea seguro para guardar en el sistema de archivos
    nombre_base, extension = os.path.splitext(nombre_imagen) #Separa el nombre del archivo de su extensión.
    nombre_imagen = f"{nombre_base}_{int(time.time())}{extension}" #Genera un nuevo nombre para la imagen usando un timestamp, para evitar sobreescrituras y conflictos de nombres.

    nuevo_codigo = catalogo.agregar_producto(titulo, descripcion, cantidad, precio, nombre_imagen)
    if nuevo_codigo:    
        imagen.save(os.path.join(RUTA_DESTINO, nombre_imagen))

        #Si el producto se agrega con éxito, se devuelve una respuesta JSON con un mensaje de éxito y un código de estado HTTP 201 (Creado).
        return jsonify({"mensaje": "Producto agregado correctamente.", "codigo": nuevo_codigo, "titulo": titulo, "descripcion": descripcion, "precio": precio, "imagen": nombre_imagen}), 201
    else:
        #Si el producto no se puede agregar, se devuelve una respuesta JSON con un mensaje de error y un código de estado HTTP 500 (Internal Server Error).
        return jsonify({"mensaje": "Error al agregar el producto."}), 500
    

#--------------------------------------------------------------------
# Modificar un producto según su código
#--------------------------------------------------------------------
@app.route("/productos/<int:codigo>", methods=["PUT"])
#La ruta Flask /productos/<int:codigo> con el método HTTP PUT está diseñada para actualizar la información de un producto existente en la base de datos, identificado por su código.
#La función modificar_producto se asocia con esta URL y es invocada cuando se realiza una solicitud PUT a /productos/ seguido de un número (el código del producto).
def modificar_producto(codigo):
    if request.method == 'OPTIONS':
        response = app.make_response('')
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Authorization, Content-Type, X-Requested-With")
        return response
    elif request.method == 'PUT':
        try:
            #Se recuperan los nuevos datos del formulario
            nuevo_titulo = request.form.get("titulo")
            nueva_descripcion = request.form.get("descripcion")
            nueva_cantidad = request.form.get("cantidad")
            nuevo_precio = request.form.get("precio")
    
    
            # Verifica si se proporcionó una nueva imagen
            if 'imagen' in request.files:
                imagen = request.files['imagen']
            # Procesamiento de la imagen
                nombre_imagen = secure_filename(imagen.filename) #Chequea el nombre del archivo de la imagen, asegurándose de que sea seguro para guardar en el sistema de archivos
                nombre_base, extension = os.path.splitext(nombre_imagen) #Separa el nombre del archivo de su extensión.
                nombre_imagen = f"{nombre_base}_{int(time.time())}{extension}" #Genera un nuevo nombre para la imagen usando un timestamp, para evitar sobreescrituras y conflictos de nombres.

                # Guardar la imagen en el servidor
                imagen.save(os.path.join(RUTA_DESTINO, nombre_imagen))
        
                # Busco el producto guardado
                producto = catalogo.consultar_producto(codigo)
                if producto: # Si existe el producto...
                    imagen_vieja = producto["imagen_url"]
                    # Armo la ruta a la imagen
                    ruta_imagen = os.path.join(RUTA_DESTINO, imagen_vieja)

                    # Y si existe la borro.
                    if os.path.exists(ruta_imagen):
                        os.remove(ruta_imagen)
    
            else:
                # Si no se proporciona una nueva imagen, simplemente usa la imagen existente del producto
                producto = catalogo.consultar_producto(codigo)
            if producto:
                nombre_imagen = producto["imagen_url"]


            # Se llama al método modificar_producto pasando el codigo del producto y los nuevos datos.
            if catalogo.modificar_producto(codigo, nuevo_titulo, nueva_descripcion, nueva_cantidad, nuevo_precio, nombre_imagen):
        
                #Si la actualización es exitosa, se devuelve una respuesta JSON con un mensaje de éxito y un código de estado HTTP 200 (OK).
                return jsonify({"mensaje": "Producto modificado"}), 200
            else:
            #Si el producto no se encuentra (por ejemplo, si no hay ningún producto con el código dado), se devuelve un mensaje de error con un código de estado HTTP 404 (No Encontrado).
                return jsonify({"mensaje": "Producto no encontrado"}), 403
        except Exception as e:
            print(f"Error en la vista: {str(e)}")
            return jsonify({'message': str(e)}), 500



#--------------------------------------------------------------------
# Eliminar un producto según su código
#--------------------------------------------------------------------
@app.route("/productos/<int:codigo>", methods=["DELETE"])
#La ruta Flask /productos/<int:codigo> con el método HTTP DELETE está diseñada para eliminar un producto específico de la base de datos, utilizando su código como identificador.
#La función eliminar_producto se asocia con esta URL y es llamada cuando se realiza una solicitud DELETE a /productos/ seguido de un número (el código del producto).
def eliminar_producto(codigo):
    # Busco el producto en la base de datos
    producto = catalogo.consultar_producto(codigo)
    if producto: # Si el producto existe, verifica si hay una imagen asociada en el servidor.
        imagen_vieja = producto["imagen_url"]
        # Armo la ruta a la imagen
        ruta_imagen = os.path.join(RUTA_DESTINO, imagen_vieja)

        # Y si existe, la elimina del sistema de archivos.
        if os.path.exists(ruta_imagen):
            os.remove(ruta_imagen)

        # Luego, elimina el producto del catálogo
        if catalogo.eliminar_producto(codigo):
            #Si el producto se elimina correctamente, se devuelve una respuesta JSON con un mensaje de éxito y un código de estado HTTP 200 (OK).
            return jsonify({"mensaje": "Producto eliminado"}), 200
        else:
            #Si ocurre un error durante la eliminación (por ejemplo, si el producto no se puede eliminar de la base de datos por alguna razón), se devuelve un mensaje de error con un código de estado HTTP 500 (Error Interno del Servidor).
            return jsonify({"mensaje": "Error al eliminar el producto"}), 500
    else:
        #Si el producto no se encuentra (por ejemplo, si no existe un producto con el codigo proporcionado), se devuelve un mensaje de error con un código de estado HTTP 404 (No Encontrado). 
        return jsonify({"mensaje": "Producto no encontrado"}), 404

#--------------------------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True)