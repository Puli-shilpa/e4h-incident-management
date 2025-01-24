import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "react-query";
import React,{useEffect,useState} from "react";
import { filterFunctions } from "./newFilterFn";
import { getSearchFields } from "./searchFields";
import { InboxGeneral } from "../../services/elements/InboxService";
import {PGRService} from "../../services/elements/PGR"

const inboxConfig = (tenantId, filters) => ({
  Incident: {
    services: ["Incident"],
    searchResponseKey: "IncidentWrappers",
    businessIdsParamForSearch: "incidentId",
    businessIdAliasForSearch: "incidentId",
    fetchFilters: filterFunctions.Incident,
    _searchFn: () => PGRService.search({ tenantId, filters }),
  },
});

const callMiddlewares = async (data, middlewares) => {
  let applyBreak = false;
  let itr = -1;
  let _break = () => (applyBreak = true);
  let _next = async (data) => {
    if (!applyBreak && ++itr < middlewares.length) {
      let key = Object.keys(middlewares[itr])[0];
      let nextMiddleware = middlewares[itr][key];
      let isAsync = nextMiddleware.constructor.name === "AsyncFunction";
      if (isAsync) return await nextMiddleware(data, _break, _next);
      else return nextMiddleware(data, _break, _next);
    } else return data;
  };
  let ret = await _next(data);
  return ret || [];
};

const useNewInboxGeneral = ({ tenantId, ModuleCode, filters, middleware = [], config = {} }) => {
const [trigger, setTrigger] = useState(Date.now());
  const client = useQueryClient();
  const { t } = useTranslation();
  const { fetchFilters, searchResponseKey, businessIdAliasForSearch, businessIdsParamForSearch } = inboxConfig()[ModuleCode];
  let { workflowFilters, searchFilters, limit, offset, sortBy, sortOrder, applicationNumber, assignee} = fetchFilters(filters);
  useEffect(()=>{
   console.log("ddddfffuseNewInboxGeneral")
   setTrigger(Date.now()); 
  },[])
  const query = useQuery(
    ["INBOX", workflowFilters, searchFilters, ModuleCode, limit, offset, sortBy, sortOrder, applicationNumber, assignee,trigger],
    () =>
      InboxGeneral.Search({
        inbox: { tenantId, processSearchCriteria: workflowFilters, moduleSearchCriteria: { ...searchFilters, sortBy, sortOrder,  applicationNumber, assignee }, limit, offset },
      }),
    {
      select: (data) => {
        const { statusMap, totalCount } = data;
        if (data.items.length) {
          return data.items?.map((obj) => ({
           
            nearingSlaCount,
            statusMap,
            totalCount,
          }));
        } else {
          return [{ statusMap, totalCount, dataEmpty: true }];
        }
      },
      retry: true,
      ...config,
    }
  );

  return {
    ...query,
    searchResponseKey,
    businessIdsParamForSearch,
    businessIdAliasForSearch,
    searchFields: getSearchFields(true)[ModuleCode],
  };
};

export default useNewInboxGeneral;
