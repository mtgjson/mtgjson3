#!/usr/bin/env python
import glob
import subprocess
import multiprocessing

"""
NOTE: This script should _ONLY_ be called via "npm run"
"""
def main():
    # This will run jsonlint on all JSON files in the GITHUB/json folder.
    # Works as a multiprocessing program to get through the hundres of
    # files quicker. Any error will trigger a failure.
    lcProcessingPool = multiprocessing.Pool(None)
    lnTaskCount = range(len(gasJSONFiles))
    lasResults =[]

    lcRunningTask = lcProcessingPool.map_async(validateSchema, lnTaskCount, callback=lasResults.append)
    lcRunningTask.wait()  # Wait on the results

    # Now print the results to the user
    lbAllPass = 0
    for lsResult in lasResults[0]:
        if lsResult:
            print(lsResult)
            lbAllPass += 1

    exit(lbAllPass)

def validateSchema(value):
    try:
        subprocess.check_output(gsBashCommand.format(gasJSONFiles[value]), shell=True, stderr=subprocess.STDOUT)
    except subprocess.CalledProcessError:
        return gasJSONFiles[value] + " failed lint"
    else:
        return

if __name__ == '__main__':
    gasJSONFiles = glob.glob("json/*.json")
    gsBashCommand = "jsonlint-cli -s json/schema/singleSet.schema.json {0}"
    main()

