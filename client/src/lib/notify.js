import { toast } from 'sonner';
import { triggerToastSample } from '../components/ui/toast-presets';

export const getActiveToastDesign = () => {
  try {
    const saved = localStorage.getItem('manakai_toast_design');
    return saved ? parseInt(saved, 10) : 1;
  } catch {
    return 1;
  }
};

export const setActiveToastDesign = (designNum) => {
  try {
    localStorage.setItem('manakai_toast_design', String(designNum));
    window.dispatchEvent(new Event('toast_design_change'));
  } catch {}
};

export const notify = {
  success: (title, descriptionOrOptions, options = {}) => {
    const design = getActiveToastDesign();
    if (typeof descriptionOrOptions === 'object' && descriptionOrOptions !== null) {
      return triggerToastSample(design, 'success', { title, ...descriptionOrOptions });
    }
    return triggerToastSample(design, 'success', {
      title,
      description: typeof descriptionOrOptions === 'string' ? descriptionOrOptions : undefined,
      ...options,
    });
  },

  error: (title, descriptionOrOptions, options = {}) => {
    const design = getActiveToastDesign();
    if (typeof descriptionOrOptions === 'object' && descriptionOrOptions !== null) {
      return triggerToastSample(design, 'error', { title, ...descriptionOrOptions });
    }
    return triggerToastSample(design, 'error', {
      title,
      description: typeof descriptionOrOptions === 'string' ? descriptionOrOptions : undefined,
      ...options,
    });
  },

  info: (title, description) => {
    return toast.info(title, { description });
  },

  warning: (title, description) => {
    return toast.warning(title, { description });
  },
};

export default notify;