/**
 * Created by andrey on 29.05.16.
 */
let CopyWebpackPlugin = require('copy-webpack-plugin');

var copyConfig = new CopyWebpackPlugin([
    // {output}/file.txt
    { from: './src/images/**/*'},
    //{ from: './src/images/*', to:'images/' },
], {
    ignore: [
        // Doesn't copy any files with a txt extension
        '*.txt',

        // Doesn't copy any file, even if they start with a dot
        { glob: '**/*', dot: true }
    ],

    // By default, we only copy modified files during
    // a watch or webpack-dev-server build. Setting this
    // to `true` copies all files.
    //copyUnmodified: true
});

module.exports = copyConfig;