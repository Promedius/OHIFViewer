const handler = require('serve-handler');
const http = require('http');
const util = require('util');
const { execFile } = require('child_process');
const execFilePromise = util.promisify(execFile);
const stream = require('stream');
const pipeline = promisify(stream.pipeline);

async function runMeasurement(inputFile) {
  try {
    await execFilePromise('dcm2niix.exe', [inputFile, '-z', 'n']);
    console.log('Measurement.exe process finished');
  } catch (error) {
    console.error(error);
  }
}

async function runMeasurement(inputFile) {
  try {
    await execFilePromise('Measurement.exe', [
      inputFile,
      inputFile,
      inputFile,
      inputFile + '.csv',
      inputFile,
    ]);
    console.log('Measurement.exe process finished');
  } catch (error) {
    console.error(error);
  }
}

const saveSegmentationFileToLocal = async request => {
  const contentDispositionHeader = request.headers['content-disposition'];
  const filename = contentDispositionHeader.split(';')[1].trim().split('=')[1];
  const fileStream = fs.createWriteStream(filename);
  await pipeline(request, fileStream);
  return filename;
};

const server = http.createServer(async (request, response) => {
  // You pass two more arguments for config and middleware
  // More details here: https://github.com/vercel/serve-handler#options
  if (request.url === '/measure_segmentation') {
    const filename = await saveSegmentationFileToLocal(request);
    await translateDCMSegmentationToNifty(filename);
    await runMeasurement(`./${filename}.nii.gz`);
    fs.readFile(`./${filename}.nii.gz.csv`, 'utf8', (err, data) => {
      response.writeHead(200, { 'Content-Type': 'text/csv' });
      response.write(data);
      response.end();
    });
  }
  return handler(request, response);
});

server.listen(3000, () => {
  console.log('Running at http://localhost:3000');
});
