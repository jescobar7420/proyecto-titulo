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
URL_SUPERMARKET = "https://www.santaisabel.cl/"
ID_SUPERMARKET_DATABASE = 1
TOTAL_PAGES_PER_CATEGORY = 40
TOTAL_THREADS_CATEGORY = 5
TOTAL_THREADS_PRODUCT = 10
XPATH_LOADING_PAGE_SUPERMARKET = "//div[@class='loader active ']"

# DATABASE CONFIG
DB_HOST = "localhost"
DB_PORT = "5432"
DB_DATABASE = "proyecto-titulo2"
DB_USER = "postgres"
DB_PASSWORD = "123"

# XPATH CATEGORIES
XPATH_TITLE_CATEGORIES = "//a[@class='new-header-supermarket-title']/h3[text()!='Ofertas']/.."
XPATH_TITLE_CATEGORIES_NAME = "//a[@class='new-header-supermarket-title']/h3[text()!='Ofertas']"
XPATH_CATEGORY = "//a[@class='new-header-supermarket-dropdown-item-name'][text()!='Exclusivo en Santa Isabel']"

# XPATH CATEGORIES PRODUCT
XPATH_PRODUCT_URL = "//div[@class='shelf-product-island ']/div[@class='shelf-product-top-island']/div[@class='shelf-product-image-island']/a"
XPATH_TOTAL_PRODUCTS = "//span[@class='title-with-bar-aditional-text']"
XPATH_LOADING_PRODUCTS = "//div[@class='shelf-list-loader']"

# XPATH PRODUCT DETAILS
XPATH_LOADING_PRODUCT_DETAILS = "//div[@class='loader active product-page-loader']"
XPATH_PRODUCT_NAME = "//h1[@class='product-name']"
XPATH_PRODUCT_BRAND = "//a[@class='product-brand']"
XPATH_PRODUCT_DESCRIPTION = "//div[@class='product-description-content']"
XPATH_PRODUCT_TYPE = "//div[./div/span[contains(text(), 'Tipo de Producto')]]/div[@class='technical-information-flags-value-container']/span"
XPATH_PRODUCT_INGREDIENTS = "//div[@class='product-ingredients-text']"
XPATH_PRODUCT_SINGLE_PRICE = "//div[@class='product-info-wrapper']/div[@class='product-single-price product-single-pdp']/div/span[@class='product-sigle-price-wrapper'] | //div[@class='price-product-item regular price-with-unit price-unit-pdp is-referential is-ref-to-normal']/div/div/div/span/span/span[@class='price-best'] | //div[@class='price-product-item regular price-with-unit price-unit-pdp ']/div/div/div/span/span/span[@class='price-best']"
XPATH_PRODUCT_OLD_PRICE = "//div[@class='prices-product pdp']/div[@class='price-product-item  price-with-unit price-unit-pdp old-price-only ']/div/div[@class='price-product-old-price']/span[@class='price-product-value']"
XPATH_PRODUCT_BEST_PRICE = "//div[@class='prices-product pdp']/div[@class='price-product-item promotion regular price-unit-pdp ']/div/div/div/span/span/span[@class='price-best']"
XPATH_PRODUCT_IMAGE = "//div[@class='zoomed-image']"
XPATH_PRODUCT_ERROR = "//div[@class='error-404-empty-message']"
XPATH_PRODUCT_NO_STOCK = "//span[@class='product-flag out-of-stock']"


""" 
    FUNCTIONS
"""

def get_categories(driver):
    # Localiza los títulos de las categorías
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, XPATH_TITLE_CATEGORIES)))
    titles = driver.find_elements(By.XPATH, XPATH_TITLE_CATEGORIES)
    category_urls = []
    category_names = []
    
    # Crea un objeto ActionChains
    actions = ActionChains(driver)

    # Itera a través de cada título de categoría
    for i, title in enumerate(titles):
        # Si es el primer título, mueve el mouse para desplegar el menú
        if i == 0:
            actions.move_to_element(title).perform()
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, XPATH_CATEGORY)))
            categories = driver.find_elements(By.XPATH, XPATH_CATEGORY)
            
            for category in categories:
                href = category.get_attribute("href")
                category_name = category.text.upper()
                # Añade a la lista sólo si la URL no coincide con URL_SUPERMARKET
                if href != URL_SUPERMARKET:
                    category_urls.append(href)
                    category_names.append(category_name)
        # Si no es el primer título, toma directamente el href
        else:
            href = title.get_attribute("href")
            category_name = title.text.upper()
            # Añade a la lista sólo si la URL no coincide con URL_SUPERMARKET
            if href != URL_SUPERMARKET:
                category_urls.append(href)
                category_names.append(category_name)

    # Devuelve la lista de URLs de las categorías
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
            WebDriverWait(driver, 20).until_not(EC.presence_of_element_located((By.XPATH, XPATH_LOADING_PRODUCTS)))
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
                total_pages = int(total_products.text.replace("productos", "").strip())/TOTAL_PAGES_PER_CATEGORY
                total_pages = math.ceil(total_pages)
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
    single_price = product_info.get('single_price')
    old_price = product_info.get('old_price')
    best_price = product_info.get('best_price')
    category = product_info.get('category_id')

    # Definir precio basado en las condiciones especificadas
    if product_info['stock'] == "No":
        precio = "No disponible"
    elif single_price is not None:
        precio = f"${single_price}"
    elif old_price is not None and best_price is not None:
        precio = f"${best_price}"
    else:
        precio = "Precio no especificado"

    return f"> {id_product}/{category} - {name} - {precio}"

def get_product_details(driver, product_url, category_id, session):
    count = 1
    while True:
        try:
            driver.get(product_url)
    
            # Espera a que la página del producto cargue
            WebDriverWait(driver, 10).until_not(EC.presence_of_element_located((By.XPATH, XPATH_LOADING_PRODUCT_DETAILS)))
            
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
            product_info['name'] = upper_text(get_info(XPATH_PRODUCT_NAME, driver))
            product_info['product_id'] = generate_unique_id(product_info['name'])
            product_info['description'] = get_info(XPATH_PRODUCT_DESCRIPTION, driver)
            product_info['ingredients'] = get_info(XPATH_PRODUCT_INGREDIENTS, driver)
            product_info['single_price'] = clear_prices(get_info(XPATH_PRODUCT_SINGLE_PRICE, driver))
            product_info['old_price'] = clear_prices(get_info(XPATH_PRODUCT_OLD_PRICE, driver))
            product_info['best_price'] = clear_prices(get_info(XPATH_PRODUCT_BEST_PRICE, driver))
            product_info['brand'] = upper_text(get_info(XPATH_PRODUCT_BRAND, driver))
            product_info['type'] = upper_text(get_info(XPATH_PRODUCT_TYPE, driver))
            product_info['category_id'] = category_id
            product_info['brand_id'] = get_brand_id(session, product_info['brand'])
            product_info['type_id'] = get_type_id(session, product_info['type'])
            
            product_info['image'] = get_info(XPATH_PRODUCT_IMAGE, driver, attribute="style")
            if product_info['image'] is not None:
                product_info['image'] = product_info['image'].split('("')[1].split('")')[0]
                
            current_date = date.today().strftime("%Y-%m-%d")
            product_info['date'] = current_date
            
            product_info['product_id'] = insert_product(session, product_info)
            
            # Insertar el producto en la tabla supermercados_productos
            insert_supermarket_product(session, product_info)
            
            product_info_string = format_product_info(product_info)
            print(product_info_string)
            
            break
        except Exception as e:
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
    elif product_info['single_price'] is not None:
        normal_price = product_info['single_price']
        offer_price = None
    elif product_info['old_price'] is not None and product_info['best_price'] is not None:
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
    chrome_options.add_argument("--window-size=1920,1080")
    main_driver = webdriver.Chrome(options=chrome_options)

    try:
        main_driver.get(URL_SUPERMARKET)
        WebDriverWait(main_driver, 8).until_not(EC.presence_of_element_located((By.XPATH, XPATH_LOADING_PAGE_SUPERMARKET)))

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



