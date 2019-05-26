import sys
import cv2
import os

inputPath = sys.argv[1]
outputPath = sys.argv[2]
fileName = 'xander2.jpg'
failed = False

def process(inputPath, outputPath):
    # We need an absolute path
    dir_path = os.path.dirname(os.path.realpath(__file__))
    # Load the image from disk
    img = cv2.imread(dir_path+inputPath,0)
    if img is None:
        return False, "Image Failed to Load"

    # Apply the Canny edge detection filter
    filtered = cv2.Canny(img, 50, 50)
    if filtered is None:
        return False, "Image Failed To Filter"


    # Write the image back to disk
    out = cv2.imwrite(dir_path+outputPath, filtered)
    if out == False:
        return False, "Image Failed To Write"

    return True, "Success"

isSuccess, message = process(inputPath, outputPath)
print(message)
sys.stdout.flush()