from test_dqn import GetRegions


done = False
policies = ['power_only','cov_only']

# Call the class before starting the loop
get_regions = GetRegions(policies, 'MovieLens')

fakedata = {
                    'power':                                                            1.0,
                    'fdr':                                                                          0.0,
                    'max_pval':                                                                                     0.0,
                    'min_pval':                                                                                     0.0,
                    'sum_pval':                                                                                     0.0,
                    'coverage':                                                                               0.004967,
                    'firs_data_region':                                                                      "Animation",
                    'input_data_region':                                                                      "Animation",
                    'attributes_combination_input_data_region':                                                  "genre",
                    'cust_ids_input_data_region':                     [{6016, 6017, 6018, 6019, 6021, 6022, 6023}],
                    'hypothesis':                                                           [['One-Sample', 2.5, 'mean']],
                    'action':                                                                                  "Exploit",
                    'size_output_set':                                                                                1,
                    'output_data_regions':                                               ['F_Animation'],
                    'attributes_combination_output_data_regions':                     ['gender_genre'],
                    'cust_ids_output_data_regions':                   [{6017, 6025, 6029, 6031, 6035, 6036, 6037}],
                    'size_ouptput_data_regions':                                                               7,
                    'done':                                                                                      False}

regions = []
actions = []
outputs = []
functions = []

#This loop is to simulate a fully guided

i = 0
stop = False

originaldf_all=pd.read_csv('originaldf_all.csv', encoding='utf-8')

while True:
    if (i == 0) or done:
        df = get_regions.get_results('power_only')
        # df = pd.DataFrame(fakedata)
    else:
        df = get_regions.get_results('power_only', prev_selected=selected_group, list_regions=list_regions, agg_function=agg_function)
        # df = pd.DataFrame(fakedata)

    prev_selected = df.firs_data_region.values[0]
    selected_group = df.input_data_region.values[0]
    list_regions = df.output_data_regions.values[0]
    agg_function = df.hypothesis.values[0][2]
    action = df.action.values[0]
    done = df.done.values[0]

    # Generate plots
    result1 = getregions_hypo2(df.iloc[0], originaldf_all)
    print(df)
    print(result1)
    print('---')

    regions.append(selected_group)
    actions.append(action)
    outputs.append(list_regions)
    functions.append(agg_function)

    if stop:
        break

    if i == 2:
        break

    i += 1



print(f'Start region: {regions[0]}')
print(f'Exploit using {functions[0]}')
print(f'Having outputs: {outputs[0]}')
print()

for i in range(len(actions[1:])):
    print(f'{actions[1+i]} based on {regions[1+i]} using {functions[1+i]}')
    print(f'Having outputs: {outputs[1+i]}')
    print()
