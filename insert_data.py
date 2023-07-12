from dotenv import find_dotenv, load_dotenv
from langchain.embeddings import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores.pgvector import PGVector
from langchain.document_loaders import DirectoryLoader, TextLoader

load_dotenv(find_dotenv())

embeddings = OpenAIEmbeddings()
loader = DirectoryLoader(
    "./FAQ", glob="**/*.txt", loader_cls=TextLoader, show_progress=True
)
documents = loader.load()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
docs = text_splitter.split_documents(documents)

# PGVector needs the connection string to the database.
CONNECTION_STRING = "postgresql+psycopg2://admin:admin@127.0.0.1:5433/vectordb"
COLLECTION_NAME = "vectordb"


PGVector.from_documents(
    docs,
    embeddings,
    collection_name=COLLECTION_NAME,
    connection_string=CONNECTION_STRING
)
