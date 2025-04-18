package org.egov.im.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.im.config.IMConfiguration;
import org.egov.im.repository.ServiceRequestRepository;
import org.egov.im.web.models.RequestInfoWrapper;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.List;

import static org.egov.im.util.IMConstants.HRMS_DEPARTMENT_JSONPATH;

@Component
public class HRMSUtil {


    private ServiceRequestRepository serviceRequestRepository;

    private IMConfiguration config;


    @Autowired
    public HRMSUtil(ServiceRequestRepository serviceRequestRepository, IMConfiguration config) {
        this.serviceRequestRepository = serviceRequestRepository;
        this.config = config;
    }

    /**
     * Gets the list of department for the given list of uuids of employees
     *
     * @param uuids
     * @param requestInfo
     * @return
     */
    public List<String> getDepartment(List<String> uuids, RequestInfo requestInfo) {

        StringBuilder url = getHRMSURI(uuids, null, null);

        RequestInfoWrapper requestInfoWrapper = RequestInfoWrapper.builder().requestInfo(requestInfo).build();

        Object res = serviceRequestRepository.fetchResult(url, requestInfoWrapper);

        List<String> departments = null;

        try {
            departments = JsonPath.read(res, HRMS_DEPARTMENT_JSONPATH);
        } catch (Exception e) {
            throw new CustomException("PARSING_ERROR", "Failed to parse HRMS response");
        }

        if (CollectionUtils.isEmpty(departments))
            throw new CustomException("DEPARTMENT_NOT_FOUND", "The Department of the user with uuid: " + uuids.toString() + " is not found");

        return departments;

    }

    /**
     * Builds HRMS search URL
     *
     * @param uuids
     * @return
     */

    public StringBuilder getHRMSURI(List<String> uuids, String tenantId, String role) {

        StringBuilder builder = new StringBuilder(config.getHrmsHost());
        builder.append(config.getHrmsEndPoint());
        if (uuids != null) {
            builder.append("?uuids=");
            builder.append(StringUtils.join(uuids, ","));
            builder.append("&tenantId=");
            builder.append(tenantId);

        } else {
            builder.append("?tenantId=");
            builder.append(tenantId);
        }

        builder.append("&roles=");
        builder.append(role);

        return builder;
    }
}
