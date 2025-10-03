import type { IDialogComponentDefinitions } from '@/shared/components/dialogProvider';
import { CreateDaoDetailsDialog } from '../dialogs/createDaoDetailsDialog';
import { CreateDrawDetailsDialog } from '../dialogs/createDrawDetailsDialog';
import { CreateProcessDetailsDialog } from '../dialogs/createProcessDetailsDialog';
import { PrepareDrawDialog } from '../dialogs/prepareDrawDialog';
import { PrepareProcessDialog } from '../dialogs/prepareProcessDialog';
import { PublishDaoDialog } from '../dialogs/publishDaoDialog';
import { SetupBodyDialog } from '../dialogs/setupBodyDialog';
import { SetupStageSettingsDialog } from '../dialogs/setupStageSettingsDialog';
import { CreateDaoDialogId } from './createDaoDialogId';

export const createDaoDialogsDefinitions: Record<CreateDaoDialogId, IDialogComponentDefinitions> = {
    [CreateDaoDialogId.PUBLISH_DAO]: { Component: PublishDaoDialog },
    [CreateDaoDialogId.CREATE_DAO_DETAILS]: { Component: CreateDaoDetailsDialog, size: 'lg' },
    [CreateDaoDialogId.CREATE_DRAW_DETAILS]: { Component: CreateDrawDetailsDialog, size: 'lg' },
    [CreateDaoDialogId.CREATE_PROCESS_DETAILS]: { Component: CreateProcessDetailsDialog, size: 'lg' },
    [CreateDaoDialogId.PREPARE_DRAW]: {Component: PrepareDrawDialog, size: 'lg'},
    [CreateDaoDialogId.PREPARE_PROCESS]: { Component: PrepareProcessDialog },
    [CreateDaoDialogId.SETUP_BODY]: {
        Component: SetupBodyDialog,
        size: 'lg',
        hiddenDescription: 'app.createDao.setupBodyDialog.a11y.description',
    },
    [CreateDaoDialogId.SETUP_STAGE_SETTINGS]: {
        Component: SetupStageSettingsDialog,
        size: 'lg',
        hiddenDescription: 'app.createDao.setupStageSettingsDialog.a11y.description',
    },
};
