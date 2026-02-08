import { Plugin } from 'metalsmith';

export default htmlmin;
export type Options = {
    key: string;
};
/**
 * A Metalsmith plugin to serve as a boilerplate for other core plugins
 */
declare function htmlmin(options: Options): Plugin;
