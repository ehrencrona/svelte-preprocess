import type { PreprocessorGroup, Options } from '../types';
import { getTagInfo } from '../modules/tagInfo';
import { concat } from '../modules/utils';
import { prepareContent } from '../modules/prepareContent';

export default (options?: Options.Less): PreprocessorGroup => ({
  async style(svelteFile) {
    const { transformer } = await import('../transformers/less');
    let {
      content,
      filename,
      attributes,
      lang,
      dependencies,
    } = await getTagInfo(svelteFile);

    content = prepareContent({ options, content });

    if (lang !== 'less') {
      return { code: content };
    }

    const transformed = await transformer({
      content,
      filename,
      attributes,
      options,
    });

    return {
      ...transformed,
      dependencies: concat(dependencies, transformed.dependencies),
    };
  },
});
