package org.egov.im;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.common.utils.MultiStateInstanceUtil;
import org.egov.tracer.config.TracerConfiguration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.scheduling.annotation.EnableAsync;

import java.util.TimeZone;

@EnableAsync
@SpringBootApplication
@ComponentScan(basePackages = { "org.egov.im", "org.egov.im.web.controllers" , "org.egov.im.config"})
@Import({TracerConfiguration.class, MultiStateInstanceUtil.class})
public class IMApp{

        @Value("${app.timezone}")
        private String timeZone;

        @Bean
        public ObjectMapper objectMapper(){
            return new ObjectMapper()
                    .configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true)
                    .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                    .setTimeZone(TimeZone.getTimeZone(timeZone));
        }


        public static void main(String[] args) throws Exception {
            SpringApplication.run(IMApp.class, args);
        }




    }
