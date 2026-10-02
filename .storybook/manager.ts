import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';
addons.setConfig({ theme: create({ base: 'light', brandTitle: 'ВСЦМ UI', colorPrimary: '#5266F4', colorSecondary: '#5266F4', fontBase: '"Manrope Variable", system-ui, sans-serif', appBorderRadius: 16 }) });
