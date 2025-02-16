import { executors, Job } from '@circleci/circleci-config-sdk';
import { FormikValues, useField } from 'formik';
import DeleteItemIcon from '../../../icons/ui/DeleteItemIcon';
import JobMapping from '../../../mappings/JobMapping';
import { useStoreActions } from '../../../state/Hooks';
import { DefinitionModel } from '../../../state/Store';
import InspectorProperty from '../../atoms/form/InspectorProperty';
import ListProperty from '../../atoms/form/ListProperty';
import StepListItem from '../../atoms/form/StepListItem';
import { StepDefinitionMenu } from '../../menus/definitions/StepDefinitionMenu';
import StepTypePageNav from '../../menus/definitions/subtypes/StepTypePage';
import { navSubTypeMenu } from '../../menus/SubTypeMenu';
import CollapsibleList from '../CollapsibleList';
import ParamListContainer from '../ParamListContainer';

export type JobInspectorProps = FormikValues & { definitions: DefinitionModel };

const getEmbeddedExecutor = (values: any) => {
  const executorKeys = ['machine', 'macos', 'docker'];

  return Object.keys(values).find((key) => executorKeys.includes(key));
};

const EmbeddedExecutor = ({
  embeddedExecutor,
  definitions,
  data,
  values,
  ...props
}: { embeddedExecutor: string; data: Job } & JobInspectorProps) => {
  const defineExecutor = useStoreActions((actions) => actions.defineExecutor);
  const embeddedHelper = useField({
    name: embeddedExecutor,
    ...props,
  })[2];
  const executor = useField({
    name: 'executor.name',
    ...props,
  })[2];

  return (
    <>
      <div className="flex flex-row">
        <p className="font-bold leading-5 tracking-wide">Executor</p>
        <button
          type="button"
          className="ml-auto tracking-wide leading-6 text-sm text-circle-blue font-medium  "
          onClick={() => {
            if (!(data.executor instanceof executors.Executor)) {
              return;
            }

            const name = data.name + '-exec-export';
            embeddedHelper.setValue(undefined);
            defineExecutor(data.executor.asReusable(name));
            executor.setValue(name);
          }}
        >
          Export as Definition
        </button>
      </div>
      <div className="px-3 py-2 my-2 bg-circle-gray-200 border w-full border-circle-gray-300 rounded flex flex-row">
        Embedded {embeddedExecutor}
        <button
          onClick={() => {
            embeddedHelper.setValue(undefined);
            executor.setValue('Select Executor');
          }}
          type="button"
          className="my-auto ml-auto"
        >
          <DeleteItemIcon className="w-3 h-3" color="#AAAAAA" />
        </button>
      </div>
    </>
  );
};

const JobInspector = ({ data, definitions, ...props }: JobInspectorProps) => {
  const navigateTo = useStoreActions((actions) => actions.navigateTo);
  const embeddedExecutor = getEmbeddedExecutor(props.values);

  return (
    <div>
      <InspectorProperty label="Name" name="name" required />
      {embeddedExecutor ? (
        <EmbeddedExecutor
          embeddedExecutor={embeddedExecutor}
          definitions={definitions}
          data={data}
          {...props}
        />
      ) : (
        <>
          <InspectorProperty
            label="Executor"
            as="select"
            name="executor.name"
            className="w-full"
            required
            dependent={(executorName) => {
              const executor = definitions.executors.find(
                (exec) => exec.name === executorName,
              );

              return (
                <>
                  {executor?.parameters && (
                    <>
                      <CollapsibleList title="Properties" expanded>
                        <div className="pt-2">
                          <ParamListContainer
                            paramList={executor.parameters}
                            parent="executor"
                          />
                        </div>
                      </CollapsibleList>
                      <div className="w-full border-b border-circle-gray-300 my-2"></div>
                    </>
                  )}
                </>
              );
            }}
          >
            {[{ name: 'Select Executor' }, ...definitions.executors].map(
              (executor) => (
                <option value={executor.name} key={executor.name}>
                  {executor.name}
                </option>
              ),
            )}
          </InspectorProperty>
        </>
      )}

      <ListProperty
        label="Steps"
        name="steps"
        values={props.values}
        expanded
        required
        listItem={StepListItem}
        emptyText="No steps defined yet."
        titleExpanded={
          <button
            type="button"
            onClick={() => {
              navigateTo(
                navSubTypeMenu(
                  {
                    typePage: StepTypePageNav,
                    menuPage: StepDefinitionMenu,
                    passThrough: { dataType: JobMapping },
                  },
                  props.values,
                ),
              );
            }}
            className="ml-auto tracking-wide hover:underline leading-6 text-sm text-circle-blue font-medium"
          >
            New
          </button>
        }
      ></ListProperty>
    </div>
  );
};

export default JobInspector;
