import { Plugin } from 'metalsmith';

export default minify;
export type Options = {
    key: string;
};
/**
 * A Metalsmith plugin to serve as a boilerplate for other core plugins
 */
declare function minify(options: Options): Plugin;
