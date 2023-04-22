import pandas as pd

from sklearn.preprocessing import LabelEncoder
from datasets import MovieLensParser
parser = MovieLensParser()
movie_lens_df = parser.get_dataframe()
print(movie_lens_df)


def getregions_hypo2(current_iteration,originaldf_all):
      originaldf_all_sample=originaldf_all

      atributes_REGION=str(current_iteration.attributes_combination_input_data_region)
      features_REGION=str(current_iteration.input_data_region)
      print("Antes")
      print(atributes_REGION)
      print(features_REGION)


      atributes_REGION=atributes_REGION.translate({ord('\''): None})
      atributes_REGION=atributes_REGION.translate({ord('\"'): None})
      atributes_REGION=atributes_REGION.translate({ord('['): None})
      atributes_REGION=atributes_REGION.translate({ord(']'): None})
      atributes_REGION=atributes_REGION.translate({ord(' '): None})
      features_REGION=features_REGION.translate({ord('\''): None})
      features_REGION=features_REGION.translate({ord('\"'): None})
      features_REGION=features_REGION.translate({ord('['): None})
      features_REGION=features_REGION.translate({ord(']'): None})
      features_REGION=features_REGION.translate({ord(' '): None})
      atributes_REGION = atributes_REGION.split('_')
      features_REGION = features_REGION.split('_')
      print("DEpois")
      print(atributes_REGION)
      print(features_REGION)
      #originaldf_all_sample=originaldf_all.sample(n = 20000)
      RegionD=originaldf_all.copy()
      for i in range(len(atributes_REGION)):
            #print(atributes_REGION[i])
            try:
                  #if (atributes_REGION[i]=="genre"):
                  #print(features_REGION[i])
                  RegionD=RegionD[RegionD[atributes_REGION[i]].str.contains(features_REGION[i])]
                  #print(RegionD)
                  #else:
                  #RegionD=RegionD[(RegionD[atributes_REGION[i]] == features_REGION[i])]
                  #print('Tamanho da Regiao nas features')
                  #print(len(SubRegion))
                  #print((SubRegion))
            except:
                #SubRegion=[]
                print('Empty Region')

      import pandas as pd
      from sklearn.preprocessing import LabelEncoder




      from sklearn import preprocessing
      #RegionD
      RegionD = RegionD.drop(columns=['tsne-2d-one','tsne-2d-two',"Unnamed: 0","Unnamed: 0.1"])



      sample_df_selected = RegionD.copy()  
      atributes_all=str(current_iteration.attributes_combination_output_data_regions)
      features_all=str(current_iteration.output_data_regions)
      print(atributes_all)
      print(features_all)
      atributes_all = atributes_all.split(',')
      features_all = features_all.split(',')
      print("output id original")
      print(current_iteration.cust_ids_output_data_regions)  
      users_pol_all=str(current_iteration.cust_ids_output_data_regions)            
      users_pol_all=users_pol_all.split('},')
      dataframe_collection = {}
      for regions_D in range(len(features_all)):
          #print(regions_D)
          atributes = atributes_all[regions_D]
          features = features_all[regions_D]
          atributes=atributes.translate({ord('\''): None})
          atributes=atributes.translate({ord('\"'): None})
          atributes=atributes.translate({ord('['): None})
          atributes=atributes.translate({ord(']'): None})
          atributes=atributes.translate({ord(' '): None})
          features=features.translate({ord('\''): None})
          features=features.translate({ord('\"'): None})
          features=features.translate({ord('['): None})
          features=features.translate({ord(']'): None})
          features=features.translate({ord(' '): None})
          atributes = atributes.split('_')
          features = features.split('_')
          #print(atributes)
          #print(features)
          SubRegion=RegionD
          for i in range(len(atributes)):
            try:
                #if (atributes[i]=="genre"):
                SubRegion=SubRegion[SubRegion[atributes[i]].str.contains(features[i])]
                #else:
                #SubRegion=SubRegion[(SubRegion[atributes[i]] == features[i])]
                #print('Tamanho da Regiao nas features')
                #print(len(SubRegion))
                #print((SubRegion))
            except:
                #SubRegion=[]
                print('Empty Region')
          #print(len(SubRegion))
          users_pol = users_pol_all[regions_D]
          users_pol=users_pol.translate({ord('\''): None})
          users_pol=users_pol.translate({ord('\"'): None})
          users_pol=users_pol.translate({ord('{'): None})
          users_pol=users_pol.translate({ord('}'): None})
          users_pol=users_pol.translate({ord('['): None})
          users_pol=users_pol.translate({ord(']'): None})

          users_pol = users_pol.split(',')
          SubRegion_aux=SubRegion.copy();
          SubRegionUsers=pd.DataFrame()
          SubRegion=pd.DataFrame()
          for i in range(len(users_pol)):
            try:
              users_pol[i]=int(users_pol[i])
              try:
                  SubRegion=SubRegion_aux[(SubRegion_aux["cust_id"] == users_pol[i])]
                  
                  #print(len(SubRegion))
                  SubRegionUsers=SubRegionUsers.append(SubRegion)
                  #print(SubRegion)
              except:
                  SubRegion=[]
                  print('Empty Region')
            except:
              print('Empty Region')
          dataframe_collection[regions_D] = pd.DataFrame(SubRegionUsers)


      for i in range(len(dataframe_collection)):
        RegionD['Region_'+str(i+1)] = 0
        for row in dataframe_collection[i].index:
          RegionD.loc[row,'Region_'+str(i+1)]=1

      aux_i=0
      for i in range(11,len(RegionD.columns)):
        print(aux_i)
        aux_i=aux_i+1

      #RegionD

      atributes_REGION_stats=str(current_iteration.attributes_combination_input_data_region)
      atributes_REGION_stats=atributes_REGION_stats.translate({ord('\''): None})
      atributes_REGION_stats=atributes_REGION_stats.translate({ord('\"'): None})
      atributes_REGION_stats=atributes_REGION_stats.translate({ord('['): None})
      atributes_REGION_stats=atributes_REGION_stats.translate({ord(']'): None})
      atributes_REGION_stats=atributes_REGION_stats.translate({ord(' '): None})
      atributes_REGION_stats = atributes_REGION_stats.split('_')

      #atributes_REGION_stats

      #STARTING TO BUILD THE STATISTICS

      #dataframe_collection
      #RegionD
      print(RegionD.columns)
      Regionall_statistics=RegionD.iloc[: , [2,3,4,5,6,7,8,9,10]].copy()

      Regionall_statistics = Regionall_statistics.assign(Region = 0)

      
      for i in range(len(dataframe_collection)):
          Regionall_statistics_aux=dataframe_collection[i].copy();
          try:
            Regionall_statistics_aux=Regionall_statistics_aux.drop(columns=['cust_id','article_id'])
          except:
            print("cust_id already deleted")
          Regionall_statistics_aux['Region']=i+1
          Regionall_statistics=Regionall_statistics.append(Regionall_statistics_aux)

      Regionall_statistics=Regionall_statistics.drop(columns=['purchase'])
      #print("AFTER ALL 3")
      #print(Regionall_statistics.columns)
      def Encoder(originaldf_all):
                    columnsToEncode = list(originaldf_all.select_dtypes(include=['category','object']))
                    le = LabelEncoder()
                    for feature in columnsToEncode:
                        try:
                            originaldf_all[feature] = le.fit_transform(originaldf_all[feature])
                        except:
                            print('Error encoding '+feature)
                    return originaldf_all



      return(Regionall_statistics)


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
                    'hypothesis':                                                           [{'One-Sample', 2.5, 'mean'}],
                    'action':                                                                                  "Exploit",
                    'size_output_set':                                                                                1,
                    'output_data_regions':                                               ['F_Animation'],
                    'attributes_combination_output_data_regions':                     ['gender_genre'],
                    'cust_ids_output_data_regions':                   [{6017, 6025, 6029, 6031, 6035, 6036, 6037}],
                    'size_ouptput_data_regions':                                                               7,
                    'done ':                                                                                      False}

originaldf_all=pd.read_csv('originaldf_all.csv', encoding='utf-8')
df = pd.DataFrame(fakedata)
#df = pd.read_csv('iteration_results_2.csv')
result1=getregions_hypo2(df.iloc[0],originaldf_all)

print(result1)
