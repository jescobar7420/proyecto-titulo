from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.common.exceptions import NoSuchElementException
from concurrent.futures import ThreadPoolExecutor
from datetime import date
from sqlalchemy import Column, Integer, String, ForeignKey, Date, BigInteger
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError
import sys
import time
import hashlib
import psycopg2
import math
import re

""" 
    SQLAlchemy Model
"""

Base = declarative_base()

class Categoria(Base):
    __tablename__ = 'categorias'
    id_categoria = Column(Integer, primary_key=True)
    categoria = Column(String)

class Marca(Base):
    __tablename__ = 'marcas'
    id_marca = Column(Integer, primary_key=True)
    marca = Column(String)

class Tipo(Base):
    __tablename__ = 'tipos'
    id_tipo = Column(Integer, primary_key=True)
    tipo = Column(String)

class Producto(Base):
    __tablename__ = 'productos'
    id_producto = Column(Integer, primary_key=True)
    categoria = Column(Integer, ForeignKey('categorias.id_categoria'))
    marca = Column(Integer, ForeignKey('marcas.id_marca'))
    tipo_producto = Column(Integer, ForeignKey('tipos.id_tipo'))
    nombre = Column(String)
    imagen = Column(String)
    descripcion = Column(String)
    ingredientes = Column(String)

    categorias = relationship("Categoria")
    marcas = relationship("Marca")
    tipo_productos = relationship("Tipo")

class Supermercado(Base):
    __tablename__ = 'supermercados'
    id_supermercado = Column(Integer, primary_key=True)
    supermercado = Column(String)
    logo = Column(String)

class SupermercadoProducto(Base):
    __tablename__ = 'supermercados_productos'
    id_supermercado = Column(Integer, ForeignKey('supermercados.id_supermercado'), primary_key=True)
    id_producto = Column(Integer, ForeignKey('productos.id_producto'), primary_key=True)
    precio_oferta = Column(Integer)
    precio_normal = Column(Integer)
    url_product = Column(String)
    fecha = Column(Date)
    disponibilidad = Column(String)

    supermercado = relationship("Supermercado")
    producto = relationship("Producto")


""" 
    GLOBAL VARIABLES
"""

URL_SUPERMARKET = "https://www.unimarc.cl/"
ID_SUPERMARKET_DATABASE = 3
TOTAL_PAGES_PER_CATEGORY = 50
TOTAL_THREADS_CATEGORY = 5
TOTAL_THREADS_PRODUCT = 10
XPATH_MAIN_PAGE_LOADING = "//h1[contains(text(), 'Nuestras categorías')]"

# DATABASE CONFIG
DB_USER = "postgres"
DB_HOST = "proyecto-titulo-db.ccs1okha1boi.us-east-1.rds.amazonaws.com"
DB_DATABASE = "proyecto_titulo_db"
DB_PASSWORD = "Xiko156354*"
DB_PORT = "5432"

# XPATH CATEGORIES
XPATH_TITLE_CATEGORIES = "//p[@class='Text_text__cB7NM Text_text--left__1v2Xw Text_text--flex__F7yuI Text_text--regular__KSs6J Text_text--md__H7JI_ Text_text--black__zYYxI Text_text__cursor--pointer__WZsQE Text_text--none__zez2n']/../.."
XPATH_TITLE_CATEGORIES_NAME = "//p[@class='Text_text__cB7NM Text_text--left__1v2Xw Text_text--flex__F7yuI Text_text--regular__KSs6J Text_text--md__H7JI_ Text_text--black__zYYxI Text_text__cursor--pointer__WZsQE Text_text--none__zez2n']"

# XPATH CATEGORIES PRODUCT
XPATH_PRODUCT_URL = "//div[@class='baseContainer_container__TSgMX baseContainer_justify-start___sjrG baseContainer_align-start__6PKCY baseContainer_flex-direction--column__iiccg baseContainer_absolute-default--topLeft__lN1In']/a[@class='Link_link___5dmQ Link_link--none__BjwPj Link_link--regular__kQISW Link_link--base__C5fOX']"
XPATH_TOTAL_PRODUCTS = "//p[@class='Text_text__cB7NM Text_text--left__1v2Xw Text_text--flex__F7yuI Text_text--regular__KSs6J Text_text--base__PWhOz Text_text--gray__r4RdT Text_text__cursor--auto__cMaN1 Text_text--none__zez2n']"

# XPATH PRODUCT DETAILS
XPATH_LOADING_PRODUCT_DETAILS = "//div[@class='loader active product-page-loader']"
XPATH_PRODUCT_NAME = "//p[@class='Text_text__cB7NM Text_text--left__1v2Xw Text_text--flex__F7yuI Text_text--regular__KSs6J Text_text--2xl__Kf5kN Text_text--black__zYYxI Text_text__cursor--auto__cMaN1 Text_text--none__zez2n']"
XPATH_PRODUCT_BRAND = "//p[@class='Text_text__cB7NM ProductDetail_textBrand__IRQMn Text_text--left__1v2Xw Text_text--flex__F7yuI Text_text--semibold__MukSj Text_text--lg__GZWsa Text_text--black__zYYxI Text_text__cursor--pointer__WZsQE Text_text--none__zez2n']"
XPATH_PRODUCT_DESCRIPTION = "//p[@class='Text_text__cB7NM Text_text--left__1v2Xw Text_text--flex__F7yuI Text_text--regular__KSs6J Text_text--lg__GZWsa Text_text--gray__r4RdT Text_text__cursor--auto__cMaN1 Text_text--none__zez2n']"
XPATH_PRODUCT_TYPE = "//p[@class='Text_text__cB7NM Text_text--left__1v2Xw Text_text--flex__F7yuI Text_text--semibold__MukSj Text_text--md__H7JI_ Text_text--tabasco__ItkMB Text_text__cursor--auto__cMaN1 Text_text--none__zez2n']"
XPATH_PRODUCT_INGREDIENTS = "//div[@id='OKTS_div_ingredients']/h6"
XPATH_PRODUCT_IMAGE = "//picture[@class='picture_picture__QMdfM']/img"
XPATH_PRODUCT_ERROR = "//p[@class='Text_text__cB7NM ErrorView_errorType__4zQgb Text_text--center__rmI85 Text_text--flex__F7yuI Text_text--semibold__MukSj Text_text--base__PWhOz Text_text--gray__r4RdT Text_text__cursor--pointer__WZsQE Text_text--none__zez2n']"
XPATH_PRODUCT_NO_STOCK = "//p[contains(text(), 'Sin stock')]"
XPATH_PRODUCT_SALE = "//p[@class='Text_text__cB7NM Text_text--center__rmI85 Text_text--flex__F7yuI Text_text--semibold__MukSj Text_text--md__H7JI_ Text_text--primary__OoK0C Text_text__cursor--auto__cMaN1 Text_text--none__zez2n']"
XPATH_PRODUCT_PROMO = "//label[@class='Text_text__cB7NM Text_text--right__CHf3V Text_text--flex__F7yuI Text_text--semibold__MukSj Text_text--3xl__tLA7o Text_text--guardsman-red__wr1D8 Text_text__cursor--auto__cMaN1 Text_text--none__zez2n']"
XPATH_PRODUCT_OLD_PRICE = "//p[@class='Text_text__cB7NM Text_text--left__1v2Xw Text_text--flex__F7yuI Text_text--semibold__MukSj Text_text--xl__l05SR Text_text--gray__r4RdT Text_text__cursor--auto__cMaN1 Text_text--line-through__1V_2e']"
XPATH_PRODUCT_BEST_PRICE = "//p[@class='Text_text__cB7NM Text_text--left__1v2Xw Text_text--flex__F7yuI Text_text--semibold__MukSj Text_text--3xl__tLA7o Text_text--guardsman-red__wr1D8 Text_text__cursor--auto__cMaN1 Text_text--none__zez2n']"
XPATH_PRODUCT_REAL_PRICE = "//p[@class='Text_text__cB7NM Text_text--left__1v2Xw Text_text--flex__F7yuI Text_text--semibold__MukSj Text_text--xl__l05SR Text_text--gray__r4RdT Text_text__cursor--auto__cMaN1 Text_text--none__zez2n']"
XPATH_PRODUCT_INTERNET = "//div[contains(text(), 'Exclusivo Internet')]"

# FILTERS
CATEGORIES_FILTER = {
    "BEBÉS Y NIÑOS": "BEBÉ",
    "BEBIDAS Y LICORES": "BOTILLERÍA",
    "CARNES": "CARNICERÍA",
    "LÁCTEOS, HUEVOS Y REFRIGERADOS": "LÁCTEOS"
}

""" 
    FUNCTIONS
"""

def get_categories(driver):
    # Localiza los elementos de las categorías
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, XPATH_TITLE_CATEGORIES)))
    category_elements = driver.find_elements(By.XPATH, XPATH_TITLE_CATEGORIES)
    category_urls = []
    category_names = []
    
    # Itera a través de cada elemento de categoría
    for element in category_elements:
        # Obtiene el atributo href (la URL de la categoría)
        href = element.get_attribute("href")
        
        # Encuentra el elemento p dentro del elemento actual y obtiene su texto (el nombre de la categoría)
        name_element = element.find_element(By.XPATH, "." + XPATH_TITLE_CATEGORIES_NAME)
        category_name = name_element.get_attribute('textContent').upper()
        
        # Reemplaza el nombre de la categoría si se encuentra en el filtro
        if category_name in CATEGORIES_FILTER:
            category_name = CATEGORIES_FILTER[category_name]

        # Añade a la lista sólo si la URL no coincide con URL_SUPERMARKET
        if href != URL_SUPERMARKET:
            category_urls.append(href)
            category_names.append(category_name)

    # Devuelve la lista de URLs y nombres de las categorías
    return category_urls, category_names


def get_product_urls(driver, category_url):
    product_urls = []
    count = 1
    page_number = 1
    total_pages = 0
    
    while True:
        # Modify the URL to add the page number
        paged_url = category_url + "?page=" + str(page_number)
        driver.get(paged_url)
        
        # Wait load page
        try:
            WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.XPATH, XPATH_TOTAL_PRODUCTS)))
        except:
            print("Can't load page {}, try {}".format(paged_url, count))
            count += 1
            continue
        
        if count > 5:
            print("Can't load page {}, try {}".format(paged_url, count))
            return product_urls
           
        # obtener los urls de los productos de la página actual
        try:
            WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.XPATH, XPATH_PRODUCT_URL)))
            product_elements = driver.find_elements(By.XPATH, XPATH_PRODUCT_URL)
        except TimeoutException:
            print("Can't load page {}, try {}".format(paged_url, count))
            count += 1
            continue
        
        if total_pages == 0:
            try:
                WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.XPATH, XPATH_TOTAL_PRODUCTS)))
                total_products = driver.find_element_by_xpath(XPATH_TOTAL_PRODUCTS)
        
                # Extraer el número de la cadena de texto usando una expresión regular
                num_results = re.findall(r"\d+", total_products.text)
        
                # Comprobar que se encontró un número
                if num_results:
                    # Convertir la lista de cadenas numéricas a int y tomar el primer elemento
                    total_pages = int(num_results[0])/TOTAL_PAGES_PER_CATEGORY
                    total_pages = math.ceil(total_pages)
                else:
                    print("No se encontró ningún número en '{}'. Por favor, comprueba el texto.".format(total_products.text))
        
            except TimeoutException:
                print("Can't load page {}, try {}".format(paged_url, count))
                count += 1
                continue
        
        for product_element in product_elements:
            href = product_element.get_attribute("href")
            product_urls.append(href)

            
        if page_number == total_pages:
            break
        page_number += 1
        
    return product_urls

def get_info(xpath, driver, attribute=None):
        try:
            element = driver.find_element(By.XPATH, xpath)
            if attribute:
                return element.get_attribute(attribute)
            return element.text
        except NoSuchElementException:
            return None
            
def clear_prices(price):
    if price:
        return price.replace(".", "").replace("$", "").replace(" ", "")
    else:
        return None
        
def upper_text(text):
    if text:
        return text.upper()
    else:
        return None
    
def clear_code(code):
    string_num = re.sub(r'\D', '', code)
    return string_num
    
def generate_unique_id(product_name):
    hash_object = hashlib.md5(product_name.encode())
    hex_dig = hash_object.hexdigest()
    return int(hex_dig[-7:], 16)
        
def format_product_info(product_info):
    id_product = product_info['product_id']
    name = product_info['name']
    old_price = product_info.get('old_price')
    best_price = product_info.get('best_price')
    category = product_info.get('category_id')
    
    # Definir precio basado en las condiciones especificadas
    if product_info['stock'] == "No":
        precio = "No disponible"
    elif old_price is not None and best_price is None:
        precio = f"${old_price}"
    elif old_price is not None and best_price is not None:
        precio = f"${best_price}"
    else:
        precio = "Precio no especificado"

    return f"> {id_product}/{category} - {name} - {precio}"
    
def normalize_product_name(name):
    return name.replace("-", " ").replace(",", ".")

def get_product_details(driver, product_url, category_id, session):
    count = 1
    while True:
        try:
            driver.get(product_url)
            try:
                WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, XPATH_PRODUCT_ERROR)))
                print("Product error, skipping product: " + product_url)
                return
            except TimeoutException:
                pass

            # Crea un diccionario vacío para almacenar la información del producto
            product_info = {}
            product_info['url'] = product_url
            product_info['stock'] = "Yes" if get_info(XPATH_PRODUCT_NO_STOCK, driver) is None else "No"
            product_info['name'] = normalize_product_name(upper_text(get_info(XPATH_PRODUCT_NAME, driver)))
            product_info['product_id'] = generate_unique_id(product_info['name'])
            product_info['description'] = get_info(XPATH_PRODUCT_DESCRIPTION, driver)
            product_info['ingredients'] = get_info(XPATH_PRODUCT_INGREDIENTS, driver)

            # Lógica para manejar los diferentes escenarios de precio
            if product_info['stock'] == "No":
                product_info['old_price'] = None
                product_info['best_price'] = None
            else:
                sale = get_info(XPATH_PRODUCT_SALE, driver)
                promo = get_info(XPATH_PRODUCT_PROMO, driver)
                internet = get_info(XPATH_PRODUCT_INTERNET, driver) 
                
                if sale: 
                    product_info['old_price'] = clear_prices(get_info(XPATH_PRODUCT_OLD_PRICE, driver))
                    product_info['best_price'] = clear_prices(get_info(XPATH_PRODUCT_BEST_PRICE, driver))
                elif promo:  
                    product_info['old_price'] = clear_prices(get_info(XPATH_PRODUCT_REAL_PRICE, driver)) 
                    product_info['best_price'] = None  
                elif internet:
                    product_info['old_price'] = clear_prices(get_info(XPATH_PRODUCT_OLD_PRICE, driver)) 
                    product_info['best_price'] = None  
                else: 
                    product_info['old_price'] = clear_prices(get_info(XPATH_PRODUCT_BEST_PRICE, driver))  
                    product_info['best_price'] = None  

            product_info['brand'] = upper_text(get_info(XPATH_PRODUCT_BRAND, driver))
            product_info['type'] = upper_text(get_info(XPATH_PRODUCT_TYPE, driver))
            product_info['category_id'] = category_id
            product_info['brand_id'] = get_brand_id(session, product_info['brand'])
            product_info['type_id'] = get_type_id(session, product_info['type'])
            product_info['image'] = get_info(XPATH_PRODUCT_IMAGE, driver, attribute="src")

            current_date = date.today().strftime("%Y-%m-%d")
            product_info['date'] = current_date

            product_info['product_id'] = insert_product(session, product_info)

            # Insertar el producto en la tabla supermercados_productos
            insert_supermarket_product(session, product_info)

            product_info_string = format_product_info(product_info)
            print(product_info_string)

            break
        except Exception as e:
            print(e)
            if count > 5:
                print("Failed to load product details for {}, tried {} times".format(product_url, count))
                return
            print("Failed to load product details for {}, retrying ({}/{})".format(product_url, count, 5))
            count += 1
            continue

    
def insert_categories(session, category_names):
    id_map = {}
    for name in category_names:
        # Comprueba si la categoría ya existe en la base de datos
        category = session.query(Categoria).filter_by(categoria=name).first()
        if category is None:
            # Si la categoría no existe, la inserta en la base de datos
            category = Categoria(categoria=name)
            session.add(category)
            session.commit()
        # Añade la categoría y su ID al diccionario
        id_map[name] = category.id_categoria
    return id_map
    
def insert_product(session, product_info):
    # Comprueba si el producto ya existe en la base de datos
    product = session.query(Producto).filter_by(nombre=product_info['name']).first()
    if product is None:
        # Si el producto no existe, lo inserta en la base de datos
        product = Producto(id_producto=product_info['product_id'],
                           categoria=product_info['category_id'],
                           marca=product_info['brand_id'],
                           tipo_producto=product_info['type_id'],
                           nombre=product_info['name'],
                           imagen=product_info['image'],
                           descripcion=product_info['description'],
                           ingredientes=product_info['ingredients'])
        session.add(product)
    else:
        # Si el producto ya existe, actualiza su información
        product.imagen = product_info['image']
        product.descripcion = product_info['description']
        product.ingredientes = product_info['ingredients']
        
    # Guarda los cambios y devuelve el ID del producto
    session.commit()
    return product.id_producto

def insert_supermarket_product(session, product_info):
    # Configurar precios
    if product_info['stock'] == "No":
        normal_price = None
        offer_price = None
    elif product_info['old_price'] is not None or product_info['best_price'] is not None:
        normal_price = product_info['old_price']
        offer_price = product_info['best_price']
    else:
        print("Product in stock but no price found, skipping: " + product_info['url'])
        return
    
    # Verificar si el producto ya existe en la base de datos
    supermarket_product = session.query(SupermercadoProducto).get((ID_SUPERMARKET_DATABASE, product_info['product_id']))
    
    # Si el producto ya existe, actualizar los campos
    if supermarket_product:
        supermarket_product.precio_oferta = offer_price
        supermarket_product.precio_normal = normal_price
        supermarket_product.url_product = product_info['url']
        supermarket_product.fecha = product_info['date']
        supermarket_product.disponibilidad = product_info['stock']
    # Si el producto no existe, crear una nueva instancia
    else:
        supermarket_product = SupermercadoProducto(
            id_supermercado=ID_SUPERMARKET_DATABASE, 
            id_producto=product_info['product_id'],
            precio_oferta=offer_price,
            precio_normal=normal_price,
            url_product=product_info['url'],
            fecha=product_info['date'],
            disponibilidad=product_info['stock']
        )
        session.add(supermarket_product)

    session.commit()
    
def get_brand_id(session, brand_name):
    # Comprueba si la marca ya existe en la base de datos
    brand = session.query(Marca).filter_by(marca=brand_name).first()
    if brand is None:
        # Si la marca no existe, la inserta en la base de datos
        brand = Marca(marca=brand_name)
        session.add(brand)
        session.commit()
    # Devuelve el ID de la marca
    return brand.id_marca

def get_type_id(session, type_name):
    # Comprueba si el tipo ya existe en la base de datos
    type_ = session.query(Tipo).filter_by(tipo=type_name).first()
    if type_ is None:
        # Si el tipo no existe, lo inserta en la base de datos
        type_ = Tipo(tipo=type_name)
        session.add(type_)
        session.commit()
    # Devuelve el ID del tipo
    return type_.id_tipo

def handle_category(data):
    category_url, category_id = data

    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--window-size=1920,1080")
    driver = webdriver.Chrome(options=chrome_options)

    try:
        product_urls = get_product_urls(driver, category_url)
        
    except Exception as e:
        print(f"Error handling category {category_url}: {e}")
        product_urls = []
        
    driver.quit()
    
    # Empaquetar las URLs de los productos y los IDs de las categorías juntos
    product_data = [(url, category_id) for url in product_urls]
    
    print(f"{category_url}: {len(product_urls)} productos")
    
    return product_data
    
def handle_products(product_data_list):
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--window-size=1920,1080")
    driver = webdriver.Chrome(options=chrome_options)

    # Crear una nueva sesión de SQLAlchemy para este hilo
    engine = create_engine(f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_DATABASE}")
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # Para cada par de URL de producto y ID de categoría en la lista de datos del producto de este hilo
        for product_url, category_id in product_data_list:
            get_product_details(driver, product_url, category_id, session)
    except Exception as e:
        print(f"Error handling products: {e}")
        
    driver.quit()
    session.close()

def main():
    start_time = time.time()
    
    engine = create_engine(f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_DATABASE}")
    Session = sessionmaker(bind=engine)
    session = Session()

    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument("--window-size=1920,1080")
    main_driver = webdriver.Chrome(options=chrome_options)

    try:
        main_driver.get("https://www.unimarc.cl/")
        WebDriverWait(main_driver, 10).until(EC.presence_of_element_located((By.XPATH, XPATH_MAIN_PAGE_LOADING)))
        
        # Get URLs of categories
        category_urls, category_names = get_categories(main_driver)
        
        # Insertar categorías en la base de datos y obtener un mapeo de nombres de categoría a ID
        category_id_map = insert_categories(session, category_names)
        main_driver.quit()
        session.close()

        # Empaquetar las URLs de las categorías y los IDs correspondientes juntos
        category_data = list(zip(category_urls, category_id_map.values()))
    
        # Create a ThreadPoolExecutor
        with ThreadPoolExecutor(max_workers=TOTAL_THREADS_CATEGORY) as executor:
            # Obtener las URLs de los productos y sus IDs de categoría
            product_data_list = list(executor.map(handle_category, category_data))
        
        # Aplanar la lista de listas de datos de productos en una sola lista
        product_data = [item for sublist in product_data_list for item in sublist]

        # Dividir la lista de datos de productos en sublistas para cada hilo
        chunks = [product_data[i::TOTAL_THREADS_PRODUCT] for i in range(TOTAL_THREADS_PRODUCT)]
        
        # Create a second ThreadPoolExecutor
        with ThreadPoolExecutor(max_workers=TOTAL_THREADS_PRODUCT) as executor:
            # Cada hilo maneja un subconjunto de los productos
            executor.map(handle_products, chunks)
        
    except TimeoutException:
        print("La página tardó demasiado en cargarse")
        session.close()
        
    # Calcular el tiempo total de ejecución
    total_time = (time.time() - start_time) / 3600
    print(f"La recolección de datos tomó {total_time:.2f} horas.")


if __name__ == "__main__":
    main()


