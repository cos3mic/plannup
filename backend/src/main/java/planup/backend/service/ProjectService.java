package planup.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import planup.backend.model.Project;
import planup.backend.repository.ProjectRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository repo;

    public List<Project> findAll(){return repo.findAll();}

    public Optional<Project> findById(String id){return repo.findById(id);}

    public Project create(Project p){return repo.save(p);}    

    public Project update(String id, Project p){p.setId(id);return repo.save(p);}    

    public boolean delete(String id){if(repo.existsById(id)){repo.deleteById(id);return true;}return false;}
}
