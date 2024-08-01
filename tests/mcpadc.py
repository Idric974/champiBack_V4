import Adafruit_GPIO.SPI as SPI
import Adafruit_MCP3008

# Configuration du SPI
SPI_PORT = 0
SPI_DEVICE = 0
mcp = Adafruit_MCP3008.MCP3008(spi=SPI.SpiDev(SPI_PORT, SPI_DEVICE))

# Lecture des valeurs des canaux ADC (0-7)
def read_adc(channel):
    if 0 <= channel <= 2:
        value = mcp.read_adc(channel)
        return value
    else:
        raise ValueError("Le canal doit être entre 0 et 7 inclus")

# Exemple de lecture des valeurs
for channel in range(8):
    value = read_adc(channel)
    print(f"Valeur du canal {channel}: {value}")
