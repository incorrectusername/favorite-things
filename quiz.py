from cryptography.fernet import Fernet

key = 'TluxwB3fV_GWuLkR1_BzGs1Zk90TYAuhNMZP_0q4WyM='

# Oh no! The code is going over the edge! What are you going to do?
message = b'gAAAAABc_SNBlU2z7AN33Rh6bkTdtHjYsrZgBmx9u7Ta-N81jFstJ9cFfrv_giocLdNRHi_gCp2uN_SiLSkCXWauIuIUob9KyKhL6N690' \
          b'p-sTVSo3lXp0vSX0NBVlBbyAWTkzt3Zb70_xPnQt6HSKiTOoiw8GOS94caQdSunqs1bmPDpflwg22w='


def main():
    f = Fernet(key)
    # token = f.encrypt(message)
    print(f.decrypt(message))


if __name__ == "__main__":
    main()
